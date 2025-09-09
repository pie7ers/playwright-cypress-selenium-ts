// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { getStringWithHyphens, getSuitsPath } from '../../utils/strings'
//it's required to generate the report
import 'cypress-mochawesome-reporter/register'

let TEST_ID = 1


beforeEach(() => {
  let testId = TEST_ID++
  const titlePath = Cypress.currentTest!.titlePath;
  const test = titlePath.at(-1);
  const suiteName = getStringWithHyphens(getSuitsPath(titlePath)) || "root";
  const testName = test || "unknown";
  Cypress.env('CURRENT_TEST_PATH', `${suiteName}/${testId}-${testName}`);
  cy.log(`Current test path: ${Cypress.env('CURRENT_TEST_PATH')}`);
})