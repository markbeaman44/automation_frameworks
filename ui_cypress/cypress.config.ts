/// <reference types="cypress" />
/// <reference path="./cypress/support/e2e.d.ts" />

/**
 * @type {Cypress.PluginConfig}
 */

import { defineConfig } from "cypress";
import { preprocessor } from "@badeball/cypress-cucumber-preprocessor/browserify";
const resolve = require("resolve");

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on(
        "file:preprocessor",
        preprocessor(config, {
          typescript: resolve.sync("typescript", {
            baseDir: config.projectRoot + "/cypress",
          }),
        }),
      );
    
      return Object.assign({}, config, {
        supportFile: 'cypress/support/e2e.ts',
      });
    },
    specPattern: ["**/*.feature", "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"],
    baseUrl: "https://www.saucedemo.com/",
  },
  chromeWebSecurity: false,
  watchForFileChanges: false,
  retries: {
    runMode: 2
  }
});
