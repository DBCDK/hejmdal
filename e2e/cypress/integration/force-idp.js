context('Netpunkt form', () => {
  it('Should be forced to login with idp=netpunkt', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    const serviceUrl = `${Cypress.config().baseUrl}/example`;

    const authorize = `/oauth/authorize?response_type=code&client_id=netpunkt&redirect_uri=${serviceUrl}&idp=netpunkt`;
    cy.visit(authorize);
  });
});
