/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  return Object.assign({}, config, {
    fixturesFolder: 'tests/fixtures',
    integrationFolder: 'tests/integration',
    screenshotsFolder: 'tests/screenshots',
    videosFolder: 'tests/videos',
    supportFile: 'tests/support/index.js'
  })
}
