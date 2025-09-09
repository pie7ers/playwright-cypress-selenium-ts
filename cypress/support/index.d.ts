declare namespace Cypress {
  interface Chainable {
    fullScreenshot(complement: string): Chainable;
    loadViewport(viewport: Record<string,any>): Chainable;
  }
}