import { chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ─── Parse --url argument ─────────────────────────────────────────────────────
// Usage:  npm run record -- --url saucedemo.com
const urlArgIdx = process.argv.indexOf('--url');
let URL_ARG: string | null = urlArgIdx !== -1 ? process.argv[urlArgIdx + 1] : null;
if (!URL_ARG && process.argv.length > 2) {
    const lastArg = process.argv[process.argv.length - 1];
    if (lastArg && !lastArg.startsWith('-') && !lastArg.endsWith('.ts') && !lastArg.endsWith('.js')) {
        URL_ARG = lastArg;
    }
}

interface Action {
    type: 'click' | 'input' | 'assert' | 'navigation';
    selector: string;
    value?: string;
    tagName?: string;
    timestamp?: number;
    userPrompt?: string;
    assertion?: string;
    role?: string;
    attributeName?: string;
}

const UI_DIR = path.join(process.cwd(), 'e2e_recorder', 'app');
const RECORDING_DIR = path.join(process.cwd(), 'e2e_recorder', 'recordings');
const RECORDING_PATH = path.join(RECORDING_DIR, 'latest.json');

let events: Action[] = [];
let isReplaying = false;

const CSS = fs.readFileSync(path.join(UI_DIR, 'styles.css'), 'utf8');
const HTML = fs.readFileSync(path.join(UI_DIR, 'index.html'), 'utf8');
const APP_JS = fs.readFileSync(path.join(UI_DIR, 'app.js'), 'utf8');

// Injected into every page to push content away from the recorder bars
const BODY_PAD_CSS = `
html { box-sizing: border-box; }
body {
  padding-top:    50px !important;
  padding-bottom: 56px !important;
  padding-right:  350px !important;
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Inject the recorder UI into a live page via page.evaluate (CDP — no CSP limit)
// ─────────────────────────────────────────────────────────────────────────────
async function injectUI(page: Page, needsChoice: boolean = false) {
    try {
        await page.evaluate(
            ({ css, html, appJs, bodyPad, currentActions, isReplaying, needsChoice }: {
                css: string; html: string; appJs: string;
                bodyPad: string; currentActions: Action[]; isReplaying: boolean; needsChoice: boolean;
            }) => {
                if (!document.body) return;   // safety guard

                // ── cleanup previous injection ──────────────────────────────
                for (const id of ['__recorder_root__', '__recorder_styles__', '__recorder_body_pad__']) {
                    document.getElementById(id)?.remove();
                }

                // ── body padding (pushes page under the bars) ───────────────
                const padEl = document.createElement('style');
                padEl.id = '__recorder_body_pad__';
                padEl.textContent = bodyPad;
                document.head.appendChild(padEl);

                // ── recorder CSS ────────────────────────────────────────────
                const styleEl = document.createElement('style');
                styleEl.id = '__recorder_styles__';
                styleEl.textContent = css;
                document.head.appendChild(styleEl);

                // ── recorder HTML ───────────────────────────────────────────
                const rootEl = document.createElement('div');
                rootEl.id = '__recorder_root__';
                rootEl.innerHTML = html;
                document.body.appendChild(rootEl);

                // ── run app.js in page scope via new Function ───────────────
                // page.evaluate runs via CDP which bypasses page CSP entirely.
                (window as any).__recorderInitialActions = currentActions;
                (window as any).__recorderIsReplaying = isReplaying;
                (window as any).__recorderNeedsChoice = needsChoice;
                // eslint-disable-next-line no-new-func
                (new Function(appJs))();
            },
            { css: CSS, html: HTML, appJs: APP_JS, bodyPad: BODY_PAD_CSS, currentActions: events, isReplaying, needsChoice }
        );
    } catch (err: any) {
        // Page may have navigated away mid-inject — not fatal
        console.error('[REC] inject error:', err.message);
    }
}

async function runRecorder() {
    console.log('🎥 Starting E2E Interactive Recorder...\n');

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // ── Check for previous session ─────────────────────────────────────────────
    let previousActions: Action[] | null = null;
    try {
        if (fs.existsSync(RECORDING_PATH)) {
            const parsed = JSON.parse(fs.readFileSync(RECORDING_PATH, 'utf8'));
            if (Array.isArray(parsed.actions) && parsed.actions.length > 1) {
                previousActions = parsed.actions;
            }
        }
    } catch (e) { }

    let isWaitingForSessionChoice = !!previousActions;

    let sessionChoiceResolver: (choice: 'new' | 'continue') => void;
    const sessionChoicePromise = new Promise<'new' | 'continue'>(r => sessionChoiceResolver = r);

    await context.exposeFunction('onSessionChoice', (choice: 'new' | 'continue') => {
        sessionChoiceResolver(choice);
    });

    // ── Expose Node.js functions to every page ────────────────────────────────

    await context.exposeFunction('onAction', (action: Action) => {
        if (isReplaying) return;
        console.log(`[REC] ${action.type}: ${action.selector}`);
        events.push(action);
        saveRecording();
    });

    await context.exposeFunction('onUpdateAction', (index: number, data: Partial<Action>) => {
        if (events[index]) {
            events[index] = { ...events[index], ...data };
            saveRecording();
        }
    });

    await context.exposeFunction('onDeleteAction', (index: number) => {
        if (index >= 0 && index < events.length) {
            console.log(`[REC] Deleted #${index}`);
            events.splice(index, 1);
            saveRecording();
        }
    });

    await context.exposeFunction('onNavigate', async (url: string) => {
        if (isReplaying) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        console.log(`[REC] → ${url}`);

        // If the very first action is an empty/about:blank nav, just replace it
        if (events.length === 1 && events[0].type === 'navigation' && events[0].selector === 'about:blank') {
            events[0].selector = url;
            events[0].timestamp = Date.now();
        } else {
            events.push({ type: 'navigation', selector: url, timestamp: Date.now() });
        }

        saveRecording();
        // Navigate — page.on('load') fires afterwards and re-injects UI
        await page.goto(url, { waitUntil: 'domcontentloaded' });
    });

    await context.exposeFunction('onFinish', async () => {
        console.log('\n💾 Recording saved. Browser kept open. Close window to exit.');
        saveRecording();
        // Browser stays open — user can still browse or close manually
    });

    await context.exposeFunction('onClearAndRestart', async () => {
        events = [{ type: 'navigation', selector: 'about:blank', timestamp: Date.now() }];
        saveRecording();
        console.log('[REC] Cleared — ready to record again.');
    });

    await context.exposeFunction('onReplay', async () => {
        if (isReplaying) return;
        console.log('[REC] Replaying', events.length, 'actions...');
        isReplaying = true;

        if (events.length > 0 && events[0].type !== 'navigation') {
            console.log('[REC] Replay: First action is not navigation, reloading current page...');
            await page.reload({ waitUntil: 'domcontentloaded' });
        }

        for (let i = 0; i < events.length; i++) {
            const action = events[i];
            try {
                // Highlight current action in UI
                await page.evaluate((idx) => {
                    if ((window as any).__recorderSetActiveStep) {
                        (window as any).__recorderSetActiveStep(idx);
                    }
                }, i);

                if (action.type === 'navigation') {
                    console.log(`[REC] Selectively navigating to ${action.selector}...`);
                    await page.goto(action.selector, { waitUntil: 'domcontentloaded' });
                } else {
                    const locator = action.role ? page.getByRole(action.role as any, { name: action.selector, exact: true }).first() : page.locator(action.selector).first();

                    if (action.type === 'click') {
                        await locator.click();
                    } else if (action.type === 'input') {
                        await locator.fill(action.value || '');
                    } else if (action.type === 'assert') {
                        console.log(`[REC] Selectively asserting ${action.assertion} on ${action.selector}...`);
                        // Replay assertion is strictly visual here, could optionally bind standard assertions
                    }
                }
                await page.waitForTimeout(300); // brief pause between actions
            } catch (e: any) {
                console.warn('[REC] Replay step failed:', e.message);
            }
        }

        // Clear highlight
        await page.evaluate(() => {
            if ((window as any).__recorderSetActiveStep) {
                (window as any).__recorderSetActiveStep(-1);
            }
        });

        console.log('[REC] Replay complete.');
        isReplaying = false;
        await page.evaluate((acts) => {
            if ((window as any).__recorderRestoreState) {
                (window as any).__recorderRestoreState(acts, false);
            }
        }, events);
    });

    // ── Re-inject UI on EVERY page load (covers GO nav + in-page link clicks) ─
    page.on('load', async () => {
        await injectUI(page, isWaitingForSessionChoice);
    });

    // Handle single page close (clicking X on the tab/window)
    page.on('close', () => {
        console.log('\n🛑 Page closed. Exiting...');
        saveRecording();
        process.exit(0);
    });

    // ── Start fresh definition ──────────────────────────────────────────────────
    async function startFresh() {
        if (URL_ARG) {
            const startURL = URL_ARG.startsWith('http') ? URL_ARG : 'https://' + URL_ARG;
            console.log(`[REC] Opening --url: ${startURL}`);
            events.push({ type: 'navigation', selector: startURL, timestamp: Date.now() });
            saveRecording();
            await page.goto(startURL, { waitUntil: 'domcontentloaded' });
        } else {
            // No --url provided. Guarantee first event is a navigation action.
            events.push({ type: 'navigation', selector: 'about:blank', timestamp: Date.now() });
            saveRecording();
        }
    }

    // ── Start on about:blank and show modal if needed ──────────────────────────
    await page.goto('about:blank', { waitUntil: 'domcontentloaded' });
    // Ensure body exists 
    await page.evaluate(() => {
        if (!document.body) document.documentElement.appendChild(document.createElement('body'));
    });
    await injectUI(page, isWaitingForSessionChoice);

    if (previousActions) {
        console.log('[REC] Found previous session. Waiting for user choice...');
        const choice = await sessionChoicePromise;
        isWaitingForSessionChoice = false; // Reset after choice is made
        if (choice === 'continue') {
            events = previousActions;
            saveRecording();
            const firstNav = events[0]?.selector || 'about:blank';
            await page.goto(firstNav, { waitUntil: 'domcontentloaded' });
            console.log('Recorder ready — Resumed session.\n');
        } else {
            await startFresh();
            console.log('Recorder ready — type a URL in the bar and click GO.\n');
        }
    } else {
        await startFresh();
        console.log('Recorder ready — type a URL in the bar and click GO.\n');
    }

    browser.on('disconnected', () => {
        console.log('\n🛑 Browser closed.');
        saveRecording();
        process.exit(0);
    });
}

function saveRecording() {
    fs.mkdirSync(RECORDING_DIR, { recursive: true });
    fs.writeFileSync(
        RECORDING_PATH,
        JSON.stringify({ meta: { timestamp: Date.now() }, actions: events }, null, 2)
    );
}

runRecorder().catch(console.error);
