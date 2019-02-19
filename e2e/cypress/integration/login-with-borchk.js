context('Login flow', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example&presel=733000`;

  it('cy.url() - get the current URL', () => {
    cy.log('Setup client using example endpoint');
    cy.visit('example');
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

    cy.log('Login user via borchk');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'code');

    cy.log(window.location, Cypress.config().baseUrl);

    cy.log('Get access token');
    cy.hash('ticket');
    cy.get('#get-ticket-button').click();
    cy.get('[data-bind="token"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('access_token');
    });
    cy.hash('userinfo');
    cy.log('Get user info');
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });

    cy.log('Check single signon works');
    cy.visit(authorize);
    cy.location('pathname').should('eq', '/example/');

    cy.log('Log out user');
    cy.get('#logout button').click();
    cy.location('pathname').should('eq', '/logout');

    cy.visit(authorize);
    cy.location('pathname').should('eq', '/login');
  });

  it('carries through state parameter', () => {
    cy.visit(`${authorize}&state=test-state-string%2F%2F`);
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();
    cy.location('search').should('contain', 'state=test-state-string%2F%2F');
  });
});
