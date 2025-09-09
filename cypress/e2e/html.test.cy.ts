import { locators } from "../../pages/locators";
import { viewports } from "../support/viewports";

viewports.forEach(viewport => {
  describe('Cypress Simple HTML Test', () => {

    beforeEach(() => {
      cy.visit('../../html/index.html')
      cy.loadViewport(viewport)
    })

    it('should load the example page and verify the title', () => {
      cy.title().should('eq', 'Test HTML Page')
      cy.fullScreenshot('table')
    });

    it('Validate table exists', () => {
      cy.get(locators.table).should('be.visible')
    });

    it('Validate user name is bold when role is admin', () => {
      cy.get(locators.rows).each(($row) => {
        const role = $row.find(locators.roleCell).text();
        cy.wrap($row).find(locators.usernameCell).should('have.css', 'font-weight', role === 'admin' ? '700' : '400');
      })
    })

    it('Validate columns sequence is correct', () => {
      const expectedHeaders = ['User Id', 'Name', 'Email', 'Role'];
      cy.get(`${locators.table} thead tr th`)
        .should('have.length', expectedHeaders.length)
        .each(($header, index) => {
          cy.wrap($header).should('have.text', expectedHeaders[index])
        })
    })

    it('Validate email, name and role columns exist', () => {
      cy.get(`${locators.table} thead tr th`).each(($header) => {
        cy.wrap($header).should('be.visible')
      })
    })

    it('Checks if the "N° Records found" information is presented', () => {
      cy.get(locators.totalRecords).should('be.visible');
    })

    it('Checks if the "Records found" number is correct', () => {
      cy.get(locators.rows).then($rows => {
        cy.get(locators.totalRecords).should('have.text', `Records found: ${$rows.length}`)
      })
    })
  })
})