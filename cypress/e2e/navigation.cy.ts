describe('LazyCat navigation', () => {
  it('loads the home page with the brand name', () => {
    cy.visit('/')
    cy.contains('LazyCat Trees').should('be.visible')
  })

  it('navigates to the shop via the Build & Order button', () => {
    cy.visit('/')
    cy.contains('Build & Order').first().click()
    cy.url().should('include', '/shop')
  })

  it('navigates through each main nav link', () => {
    cy.visit('/')

    // Each nav link by its visible label, asserting the URL lands right.
    // .first() because the labels appear in both desktop and mobile menus.
    cy.contains('Shop').first().click()
    cy.url().should('include', '/shop')

    cy.visit('/')
    cy.contains('Custom Order').first().click()
    cy.url().should('include', '/commission')

    cy.visit('/')
    cy.contains('Our Story').first().click()
    cy.url().should('include', '/story')

    cy.visit('/')
    cy.contains('Contact').first().click()
    cy.url().should('include', '/contact')
  })
})