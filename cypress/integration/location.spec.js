context('Location', () => {
  beforeEach(() => {
    
  });

  it('cy.url() - get the current URL', () => {
    cy.visit('example');
    // https://on.cypress.io/url
    cy.get('h3').first('h3').should('contain', 'Example client for login.bib.dk');
  });
});
