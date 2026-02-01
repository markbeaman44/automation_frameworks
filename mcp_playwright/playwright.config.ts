// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        // Browser selection
        browserName: 'chromium',

        // Visual mode (set to true for headless if needed)
        headless: false,

        // Browser launch arguments to disable password manager and related popups
        launchOptions: {
            args: [
                // Disable password manager and credential features
                '--disable-blink-features=AutomationControlled',
                '--disable-features=PasswordManager,CredentialManagementAPI',
                '--disable-password-manager-reauthentication',
                '--disable-password-generation',
                '--password-store=basic',

                // Disable save password prompts
                '--enable-features=PasswordImport',
                '--no-service-autorun',

                // Disable extensions and Chrome sync
                '--disable-extensions',
                '--disable-component-extensions-with-background-pages',
                '--disable-background-networking',
                '--disable-sync',

                // Additional safety measures
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-popup-blocking',
                '--disable-translate',
                '--disable-infobars',
                '--disable-notifications',

                // Ensure clean profile
                '--incognito',
            ],
        },

        // Additional context options
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },

    // Timeout configuration
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
});