context('Test modals', () => {
  const authorize =
    '/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=http://localhost:3011/example';

  beforeEach(() => {
    cy.visit(authorize);
  });

  it('test that help modal toggles', () => {
    cy.get('[data-cy=helptext-link]').click();
    cy.get('#helpModal').should('be.visible');
    cy.get('#helpModal > .modal-header > button').click();
    cy.get('#helpModal').should('not.be.visible');
  });
  it('test that privacy modal toggles', () => {
    cy.get('[data-cy=privacy-button]').click();
    cy.get('#privacyModal').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('#privacyModal').should('not.be.visible');
  });
});
