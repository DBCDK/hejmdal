context('Netpunkt form', () => {
  const serviceUrl = `${Cypress.config().baseUrl}/example`;
  const authorize = `/oauth/authorize?response_type=code&client_id=netpunkt&redirect_uri=${serviceUrl}`;

  beforeEach(() => {
    cy.visit(authorize);
  });

  it('Should switch type on password input field', () => {
    cy.get('#pass-input').type('12345678');
    cy.get('#pass-input').should('have.attr', 'type', 'password');
    cy.get('#toggle-pass-input').click();
    cy.get('#pass-input').should('have.attr', 'type', 'text');
    cy.get('#pass-input').should('have.value', '12345678');
  });

  it('Should validate forms', () => {
    // Assert validation errors
    cy.get('#netpunkt-submit').click();
    cy.get('#group-input-text').should('contain', 'Feltet skal udfyldes');
    cy.get('#pass-input-text').should('contain', 'Feltet skal udfyldes');

    // Clear default value in user field
    cy.get('#user-input').clear();
    cy.get('#netpunkt-submit').click();
    cy.get('#user-input-text').should('contain', 'Feltet skal udfyldes');

    // should throw validation error
    cy.get('#group-input').type('12{enter}');
    cy.get('#group-input-text').should(
      'contain',
      'Indtast et gyldigt biblioteksnummer'
    );

    // Should accept 6 char. code with leading DK-
    cy.get('#group-input').clear();
    cy.get('#group-input').type('DK-123456{enter}');
    cy.get('#group-input-text').should(
      'not.contain',
      'Indtast et gyldigt biblioteksnummer'
    );

    // Should accept 6 char. code
    cy.get('#group-input').clear();
    cy.get('#group-input').type('123456{enter}');
    cy.get('#group-input-text').should(
      'not.contain',
      'Indtast et gyldigt biblioteksnummer'
    );

    // remove validation error from user field
    cy.get('#user-input').clear();
    cy.get('#user-input').type('123456abc{enter}');
    cy.get('#user-input-text').should('not.contain', 'Feltet skal udfyldes');

    // remove validation error from password field
    cy.get('#pass-input').clear();
    cy.get('#pass-input').type('123456abc{enter}');
    cy.get('#pass-input-text').should('not.contain', 'Feltet skal udfyldes');
  });

  it('Should return error message if user is not recognized in forsrights', () => {
    cy.get('#group-input').type('100200');

    // Clear default value in user field
    cy.get('#user-input').clear();

    cy.get('#user-input').type('invalid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.get('#error-body').should(
      'contain',
      'Det ser ud til at oplysningerne ikke er rigtige'
    );
  });

});
