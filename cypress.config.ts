import { defineConfig } from "cypress";
import { parseBoolean } from "./utils/booleans"

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'cypress-test',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    env: {
      screenshotOnRunFailure: true,
      ENABLE_SCREENSHOTS: parseBoolean(process.env.ENABLE_SCREENSHOTS) || 1,
    },
    setupNodeEvents(on, _config) {
      //since cypress-mochawesome-reporter has no type definitions it's necessary to declare the package here
      //it's required to generate the report
      require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
    },
  },
});
