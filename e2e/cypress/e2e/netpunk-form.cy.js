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

  it('Should show new password modal', () => {
    cy.get('[data-cy="changePw"]').click();
    cy.get('#agencyIdNewPassword').should('have.attr', 'type', 'text');
    cy.get('#identityNewPassword').should('have.attr', 'type', 'text');
    cy.get('#newPw-submit-step1').should('have.attr', 'type', 'submit');
    cy.get('#newPw-submit-step1').click();
  });

  it.only('Should check validity of fields in new password modal', () => {
    cy.get('[data-cy="changePw"]').click();
    cy.get('#agencyIdNewPassword').type('1111');
    cy.get('#identityNewPassword').type('2222');
    cy.get('#newPw-submit-step1').click();
    cy.get('#agencyIdNewPassword-text').should('not.be.empty');

    cy.get('#agencyIdNewPassword').clear();
    cy.get('#agencyIdNewPassword').type('111111');
    cy.get('#newPw-submit-step1').click();
    cy.get('#agencyIdNewPassword-text').should('be.empty');
    cy.get('#twoFactorCode').should('be.visible');
    cy.get('#newPassword').should('be.visible');
    cy.get('#checkPassword').scrollIntoView().should('be.visible');

    cy.get('#twoFactorCode').type('111111');
    cy.get('#newPassword').type('222222');
    cy.get('#checkPassword').type('333333');
    cy.get('#newPw-submit-step2').click();
    cy.get('#newPassword-text').should('not.be.empty');
    cy.get('#checkPassword-text').should('not.be.empty');

    cy.get('#checkPassword').clear();
    cy.get('#checkPassword').type('222222');
    cy.get('#newPw-submit-step2').click();
    cy.get('#checkPassword-text').should('be.empty');

    cy.get('#newPassword').clear();
    cy.get('#newPassword').type('qlwkejrhtgyfudisos');
    cy.get('#checkPassword').clear();
    cy.get('#checkPassword').type('qlwkejrhtgyfudisos');
    cy.get('#newPw-submit-step2').click();
    cy.get('#newPassword-text').should('be.empty');
    cy.get('#checkPassword-text').should('be.empty');

    cy.get('#identityNewPassword').clear();
    cy.get('#identityNewPassword').type('to_short');
    cy.get('#newPassword').clear();
    cy.get('#newPassword').type('qlwkejr');
    cy.get('#checkPassword').clear();
    cy.get('#checkPassword').type('qlwkejr');
    cy.get('#newPw-submit-step2').click();
    cy.get('#newPassword-text').should('not.be.empty');
    cy.get('#checkPassword-text').should('be.empty');
  });
});
