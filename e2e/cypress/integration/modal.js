context('Test modals', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example`;
  it('test that help modal toggles', () => {
    cy.visit(authorize);
    cy.get('[data-cy=helptext-link]').click();
    cy.get('#helpModal').should('be.visible');
    cy.get('#helpModal h5')
      .first()
      .should('contain', 'Bibliotek');

    cy.get('#helpModal > .modal-header > button').click();
    cy.get('#helpModal').should('not.be.visible');
  });
  it('test that privacy modal toggles', () => {
    cy.visit(authorize);
    cy.get('[data-cy=privacy-button]').click();
    cy.get('#privacyModal').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('#privacyModal').should('not.be.visible');
  });
  it('test that Bibliotek is removed when agency is locked', () => {
    cy.visit(`${authorize}&agency=737000`);
    cy.get('[data-cy=helptext-link]').click();
    cy.get('#helpModal h5')
      .first()
      .should('not.contain', 'Bibliotek');
  });
});
