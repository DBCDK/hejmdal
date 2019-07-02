context('Single Logout', () => {
  it('should login to a test service', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.loginOnTestService('hejmdal-3');
    cy.loginOnTestService('hejmdal-4');
    cy.loginOnTestService('hejmdal-5');
    cy.visit('/logout?singlelogout=true');
    cy.get('body')
      .should('contain', 'hejmdal-1')
      .should('contain', 'hejmdal-2')
      .should('contain', 'hejmdal-3')
      .should('contain', 'hejmdal-4')
      .should('contain', 'hejmdal-5');
  });
});
