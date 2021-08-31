/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/triple-slash-reference: "off" */

/**
 * @type {Cypress.PluginConfig}
 */

const browserify = require('@cypress/browserify-preprocessor');
const cucumber = require('cypress-cucumber-preprocessor').default;
const resolve = require('resolve');

const path = require('path');

module.exports = (on, config) => {
  const options = {
    ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', {
      baseDir: config.projectRoot + '/cyress',
    }),
  };

  on('file:preprocessor', cucumber(options));

  return Object.assign({}, config, {
    supportFile: 'cypress/support/index.ts',
  });
};
