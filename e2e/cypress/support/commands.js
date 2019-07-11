// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('loginOnTestService', service => {
  cy.visit(`/test/service/${service}/login`);
  cy.location().then(loc => {
    if (loc.pathname === '/login') {
      cy.get('#userid-input').type('87654321');
      cy.get('#pin-input').type('1234');
      cy.get('#borchk-submit').click();
    }
  });
  cy.location('pathname').should('eq', `/test/service/${service}/callback`);
});

Cypress.Commands.add('verifyUserOnTestService', service => {
  return cy
    .request(`/test/service/${service}/verify`)
    .then(({body}) => console.log(body) || body);
});
