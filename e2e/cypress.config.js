const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  video: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '/app/e2e/reports/test-result-[hash].xml',
    toConsole: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3011',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/*.cy.{js,jsx,ts,tsx}',
  },
})
