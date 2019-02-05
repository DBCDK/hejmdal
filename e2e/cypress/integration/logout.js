context('Logout', () => {
  it('should logout with known token', () => {
    cy.visit('/logout?access_token=hejmdal-access-token');
    cy.get('#returnUrl').should(
      'have.text',
      'Tilbage til Hejmdal Test Service'
    );
  });
  it('should logout with unknown token', () => {
    cy.visit('/logout?access_token=hejmdal-access-token-unknown');
    cy.get('#returnUrl').should('have.text', 'Tilbage');
  });
  it('should redirect to return_url', () => {
    cy.visit(
      `/logout?access_token=asdfg&redirect_uri=${
        Cypress.config().baseUrl
      }/example`
    );
    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'message=logout');
  });
});
