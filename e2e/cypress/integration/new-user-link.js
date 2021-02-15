context('New user links', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example`;

  it('Should link to new user site', () => {
    cy.visit(`${authorize}&agency=733000`);
    cy.get('[data-cy=new-user-button]')
      .should('have.attr', 'href')
      .and('include', 'www.slagelsebib.dk');
  });
  it('Should open modal', () => {
    cy.visit(`${authorize}`);
    cy.get('[data-cy=new-user-button]').click();
    cy.get('#newUser-dropdown').should('exist');
    cy.get(
      '#newUser-dropdown > .input-container > [data-cy=libraryname-input]'
    ).type('sla');
    cy.get('.agency:visible')
      .first()
      .should('contain', 'Slagelse');
  });
});
