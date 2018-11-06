context('Location', () => {
  beforeEach(() => {});

  it('cy.url() - get the current URL', () => {
    cy.server();
    cy.clearCookies();
    cy.visit('example');

    // https://on.cypress.io/url
    cy.get('h3')
      .first('h3')
      .should('contain', 'Example client for login.bib.dk');

    cy.get('#input-login-client')
      .clear()
      .type('hejmdal');

    cy.get('#input-preselected-library')
      .clear()
      .type('733000');
    cy.get('#input-locked-library').clear();
    cy.get('#login-button').click();
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'code');
  });
});
