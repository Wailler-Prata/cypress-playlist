const { defineConfig } = require('cypress');

module.exports = defineConfig({
  
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: 'https://artursantiago.github.io/dev.finance/balance',
    video:false
  },
});