import type { Page } from 'playwright';

export default async ({ page }: { page: Page }) => {
    const context = page.context();

    // Hard guarantees
    await context.clearCookies();
    await context.clearPermissions();

    await page.setViewportSize({ width: 1280, height: 720 });

    // Explicitly control permissions
    await context.grantPermissions([], { origin: '*' });

    // Kill credential behaviour at the API level
    await context.addInitScript(() => {
        if ('credentials' in navigator) {
            // @ts-ignore
            navigator.credentials.get = async () => null;
            // @ts-ignore
            navigator.credentials.store = async () => { };
            // @ts-ignore
            navigator.credentials.preventSilentAccess = async () => { };
        }
    });
};
