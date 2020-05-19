context('Netpunkt form', () => {
  it('Should be forced to login with idp=netpunkt', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    const serviceUrl = `${Cypress.config().baseUrl}/example`;

    const authorize = `/oauth/authorize?response_type=code&client_id=netpunkt&redirect_uri=${serviceUrl}&idp=netpunkt`;
    cy.visit(authorize);
    cy.location('pathname').should('eq', '/login');
    cy.get('#group-input').type('100200');

    // Clear default value in user field
    cy.get('#user-input').clear();

    cy.get('#user-input').type('valid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();
    cy.location('pathname').should('eq', '/example');
  });
});
