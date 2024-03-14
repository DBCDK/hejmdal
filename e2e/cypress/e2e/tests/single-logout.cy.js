context('Single Logout', () => {
  it.skip('should login and -out through test endpoints', () => {
    // This test is to verify that the test setup works
    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
    cy.loginOnTestService('hejmdal-1');
    cy.verifyUserOnTestService('hejmdal-1').should('equal', true);
    cy.visit(`/test/service/hejmdal-1/logout`);
    cy.verifyUserOnTestService('hejmdal-1').should('equal', false);
  });
  it('should not show returnlink or undefined on default page', () => {
    cy.visit('/logout?singlelogout=true');
    cy.get('body').should('not.contain', 'undefined');
  });
  it('should login to 5 test services and add iframe to DOM', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.loginOnTestService('hejmdal-3');
    cy.loginOnTestService('hejmdal-4');
    cy.loginOnTestService('hejmdal-5');
    cy.visit('/logout?singlelogout=true');
    cy.get('.iframeWrapper iframe').should('have.length', 5);
    cy.get('iframe#hejmdal-1')
      .invoke('attr', 'src')
      .should(
        'equal',
        `${Cypress.config().baseUrl}/test/service/hejmdal-1/logout`
      );

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

  it('should redirect on succesful logout', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.visit(
      `/logout?access_token=hejmdal-1&singlelogout=true&redirect_uri=${
        Cypress.config().baseUrl
      }/example`
    );
    cy.location('pathname').should('eq', '/example/');
  });

  it('should redirect to return_url without access_token, if url can be validated against client stored in session', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.visit(
      `/logout?singlelogout=true&redirect_uri=${
        Cypress.config().baseUrl
      }/example`
    );
    cy.location('pathname').should('eq', '/example/');
  });

  it('should NOT redirect to invalid redirect_uri', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-2');
    cy.visit(
      `/logout?singlelogout=true&access_token=hejmdal-1&redirect_uri=invalid_redirect_uri`
    );
    cy.location('pathname').should('eq', '/logout');
  });

  it('should provide a link to initiator on failed logout', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-fail');
    cy.visit('/logout?singlelogout=true&access_token=hejmdal-fail');
    cy.get('.stateWrapper').should('contain', 'Tilbage til Test Service');
  });
  it('should provide a link to initiator on failed logout without access_token, but valid redirect_uri', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-fail');
    cy.visit(
      `/logout?singlelogout=true&redirect_uri=${
        Cypress.config().baseUrl
      }/example`
    );
    cy.get('.stateWrapper').should('contain', 'Tilbage til Test Service');
  });
  it('should provide a link to initiator when no return_uri', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-ok');
    cy.visit('/logout?singlelogout=true&access_token=hejmdal-ok');
    cy.get('.stateWrapper').should('contain', 'Tilbage til Test Service');
  });
  it('should not provide a link without valid return_uri and access_token', () => {
    cy.loginOnTestService('hejmdal-1');
    cy.loginOnTestService('hejmdal-ok');
    cy.visit('/logout?singlelogout=true');
    cy.get('.stateWrapper').should('not.contain', 'Tilbage til Test Service');
  });
  it('should fail single-logout if user logged in to unsupported service', () => {
    cy.loginOnTestService('hejmdal-ok');
    cy.loginOnTestService('hejmdal-no-single-logout-support');
    cy.visit('/logout?singlelogout=true&access_token=hejmdal-ok');
    cy.get('.stateWrapper').should(
      'contain',
      'Det har ikke været muligt at logge dig ud af alle dine bibliotekstjenester.'
    );
  });
});
