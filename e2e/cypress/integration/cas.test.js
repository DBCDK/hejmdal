context('CAS authorization flow', () => {
  const serviceUrl = `${Cypress.config().baseUrl}/example`;
  const authorize = `/cas/hejmdal/733000/login?service=${serviceUrl}`;

  it('should redirect to login page', () => {
    cy.visit(authorize);
    cy.location('pathname').should('eq', '/login');
  });

  it('should redirect to service url on login.', () => {
    cy.visit(authorize);
    cy.log('Login user via borchk');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'ticket');
    return;
  });
  it.only('should validate service with valid ticket', () => {
    cy.visit(authorize);
    cy.log('Login user via borchk');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/example/');
    cy.location('search').then(data => {
      const ticket = data.split('=')[1];
      expect(ticket).to.not.eq('123123123123123');
      const validateUrl = `/cas/hejmdal/733000/serviceValidate?service=${
        Cypress.config().baseUrl
      }/example&ticket=${ticket}`;
      cy.request({
        form: false,
        url: validateUrl
      })
        .its('body')
        .should('include', 'authenticationSuccess');
    });
  });
});
