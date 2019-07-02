context('Single Logout', () => {
  it('should login to a test service', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.loginOnTestService('hejmdal-3');
    cy.loginOnTestService('hejmdal-4');
    cy.loginOnTestService('hejmdal-5');
  });
});
