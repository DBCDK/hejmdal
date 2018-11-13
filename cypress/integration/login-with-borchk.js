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
    cy.get('#get-ticket-button').click();
    cy.get('[data-bind="token"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('access_token');
    });

    cy.get('#get-userinfo-button').click();

    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });
    cy.visit(
      '/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=http://localhost:3011/example&agency=733000'
    );
    cy.location('pathname').should('eq', '/example/');

    cy.get('#logout button').click();
    cy.location('pathname').should('eq', '/logout');
  });
});
