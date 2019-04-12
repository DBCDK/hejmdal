context('Logout', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example&agency=733000`;

  beforeEach(() => {
    cy.visit(`${authorize}`);
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();
    cy.get('#example > :nth-child(1)').should(
      'contain',
      'Example client for login.bib.dk'
    );
  });

  it('should logout with known token', () => {
    cy.visit(`${authorize}`);
    cy.get('h1').should('not.contain', 'Log ind');
    cy.visit('/logout?access_token=hejmdal-access-token');
    cy.get('#returnUrl').should(
      'have.text',
      'Tilbage til Hejmdal Test Service'
    );
    cy.visit(`${authorize}`);
    cy.get('h1').should('contain', 'Log ind');
  });
  it('should logout with unknown token', () => {
    cy.visit('/logout?access_token=hejmdal-access-token-unknown');
    cy.get('.content-container').should(
      'contain',
      'Du er nu logget ud af bibliotekslogin'
    );
    cy.get('#returnUrl').should('not.exist');
    cy.visit(`${authorize}`);
    cy.get('h1').should('contain', 'Log ind');
  });
  it('should redirect to return_url', () => {
    cy.visit(
      `/logout?access_token=asdfg&redirect_uri=${
        Cypress.config().baseUrl
      }/example`
    );
    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'message=logout');
    cy.visit(`${authorize}`);
    cy.get('h1').should('contain', 'Log ind');
  });
});
