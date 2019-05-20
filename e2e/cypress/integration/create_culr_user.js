context('Create Account flow', () => {
  it('should create user in culr', () => {
    cy.visit('/example');
    cy.get('#input-login-client')
      .clear()
      .type('hejmdal');
    cy.get('#login-button').click();

    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .clear()
      .type('sla{enter}');
    cy.get('#userid-input').type('0101011234');
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();
    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });
  });
});
