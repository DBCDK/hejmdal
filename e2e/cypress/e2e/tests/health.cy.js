context('/health', () => {
  beforeEach(() => {
    // Set health status to be ok.
    cy.request('test/smaug/config/health/setStatus/true');
  });

  it('Should return status 200 when services are ok', () => {
    cy.request({url: 'test/smaug/health', failOnStatusCode: false})
      .its('status')
      .should('equal', 200);
  });
  it('Should return status 503 when a service is down', () => {
    // Set smaug health endpoint to return error.
    cy.request('test/smaug/config/health/setStatus/false');
    cy.request({url: '/health', failOnStatusCode: false})
      .its('status')
      .should('equal', 503);
  });
});
