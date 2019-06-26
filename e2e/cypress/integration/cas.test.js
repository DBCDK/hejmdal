context('CAS authorization flow', () => {
  const serviceUrl = `${
    Cypress.config().baseUrl
  }/some-arbitrary-value?query=test`;
  const authorize = `/cas/hejmdal/733000/login?service=${serviceUrl}`;

  it('should redirect to login page', () => {
    cy.visit(authorize);
    cy.location('pathname').should('eq', '/login');
  });

  it('should redirect to service url on login.', () => {
    cy.visit(authorize);
    cy.log('Login user via borchk');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1111');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/some-arbitrary-value');
    cy.location('search').should('contain', 'ticket');
  });
  it('should validate service with valid ticket', () => {
    cy.visit(authorize);
    cy.log('Login user via borchk');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1111');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/some-arbitrary-value');
    cy.location('search').then(data => {
      const ticket = data.split('&')[1].split('=')[1];
      const serviceUrl = encodeURIComponent(
        `${Cypress.config().baseUrl}/some-arbitrary-value?query=test`
      );
      const validateUrl = `/cas/hejmdal/733000/serviceValidate?service=${serviceUrl}&ticket=${ticket}`;
      cy.request({
        form: false,
        url: validateUrl
      })
        .its('body')
        .should('include', 'authenticationSuccess')
        .should('include', '<cas:user>guid-87654321</cas:user>')
        .should('include', '<cas:municipality>909</cas:municipality>');
    });
  });
  it('should fail validate service with invalid service param', () => {
    cy.visit(authorize);
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1111');
    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/some-arbitrary-value');
    cy.location('search').then(data => {
      const ticket = data.split('&')[1].split('=')[1];
      const validateUrl = `/cas/hejmdal/733000/serviceValidate?service=invalid_url&ticket=${ticket}`;
      cy.request({
        form: false,
        url: validateUrl
      })
        .its('body')
        .should(
          'include',
          '<cas:authenticationFailure code="INVALID_SERVICE_URL">'
        );
    });
  });
  it('should fail with invalid ticket', () => {
    const validateUrl = `/cas/hejmdal/733000/serviceValidate?service=${
      Cypress.config().baseUrl
    }/example&ticket=invalid_ticket`;
    cy.request({
      form: false,
      url: validateUrl
    })
      .its('body')
      .should('include', '<cas:authenticationFailure code="INVALID_TICKET">');
  });
  it('should fail when using wrong clientId', () => {
    cy.visit(`/cas/wrong_id/733000/login?service=${serviceUrl}`, {
      failOnStatusCode: false
    });
    cy.get('body').should('contain', 'Invalid client');
  });
  it('should fail when using wrong service url', () => {
    cy.visit('/cas/hejmdal/733000/login?service=invalid_service_url', {
      failOnStatusCode: false
    });
    cy.get('body').should('contain', 'Invalid service url');
  });
  it('should fail when client is not CAS enabled', () => {
    cy.visit(`/cas/hejmdal-access-token/733000/login?service=${serviceUrl}`, {
      failOnStatusCode: false
    });
    cy.get('body').should(
      'contain',
      'This client cannot use CAS authorization'
    );
  });
});
