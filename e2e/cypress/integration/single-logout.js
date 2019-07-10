context('Single Logout', () => {
  it.skip('should login and -out through test endpoints', () => {
    // This test is to verify that the test setup works
    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
    cy.loginOnTestService('hejmdal-1');
    cy.verifyUserOnTestService('hejmdal-1').should('equal', true);
    cy.visit(`/test/service/hejmdal-1/logout`);
    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
  });

  it('should login to 5 test services and add iframe to DOM', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.loginOnTestService('hejmdal-3');
    cy.loginOnTestService('hejmdal-4');
    cy.loginOnTestService('hejmdal-5');
    cy.visit('/logout?singlelogout=true');
    cy.get('.iframeWrapper iframe').should('have.length', 5);

    cy.get('.stateWrapper').should(
      'contain',
      'Du er nu blevet logget ud af bibliotekslogin'
    );

    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-2').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-3').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-4').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-5').should('equal', false);
  });
  it('should fail logout if one service fails', () => {
    cy.loginOnTestService('hejmdal-ok');
    cy.loginOnTestService('hejmdal-fail');
    cy.visit('/logout?singlelogout=true');
    cy.get('.stateWrapper').should(
      'contain',
      'Det har ikke været muligt at logge dig ud af alle dine bibliotekstjenester.'
    );

    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-2').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-3').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-4').should('equal', false);
    cy.verifyUserOnTestService('hejmdal-5').should('equal', false);
  });
});
