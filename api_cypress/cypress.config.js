const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents (on, config) {
      return Object.assign({}, config, {
        supportFile: 'cypress/support/e2e.js'
      })
    },
    baseUrl: 'https://api.wheretheiss.at/',
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}']
  }
})
