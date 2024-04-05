const { DEFAULT_THEME } = require('@cucumber/pretty-formatter')

module.exports = {
  default: {
    format: ['@cucumber/pretty-formatter', 'html:reports/cucumber-report.html'],
    formatOptions: {
      colorsEnabled: true,
      theme: {
        ...DEFAULT_THEME,
        'feature keyword': ['magenta', 'bold'],
        'scenario keyword': ['green'],
        'step text': ['green'],
      },
    },
    requireModule: ['ts-node/register'],
  },
}
