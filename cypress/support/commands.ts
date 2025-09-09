/// <reference types="cypress" />

Cypress.Commands.add('loadViewport', (viewport) => {
  const [width, height] = viewport.size;
  cy.viewport(width, height);
  cy.wrap(viewport.size.join('x')).as('currentViewport');
  cy.wrap(viewport.size[0]).as('currentViewportWidth');
})

Cypress.Commands.add("fullScreenshot", (complement: string) => {
  if (!Cypress.env('')) return
  cy.get('@currentViewport').then((viewport) => {
    complement = complement ? `-${complement.split(' ').join('-')}` : ''
    const testsPath = Cypress.env('CURRENT_TEST_PATH') || 'default';
    cy.screenshot(`${testsPath}${complement}-${viewport}`, { capture: 'fullPage' });
  });
})