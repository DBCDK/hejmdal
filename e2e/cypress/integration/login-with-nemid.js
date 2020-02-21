context('Login flow with nemid', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example&presel=733000`;

  it('Should return uniloginId and uniLoginInstitutions', () => {
    cy.visit(authorize);
    cy.get('#nemlogin-btn').click();
    cy.location('pathname').should('eq', '/example/');

    cy.location('search').then(value => {
      var urlParams = new URLSearchParams(value);
      const code = urlParams.get('code');
      cy.request({
        form: true,
        url: 'oauth/token',
        method: 'post',
        auth: {
          user: 'hejmdal',
          pass: 'test'
        },
        body: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${Cypress.config().baseUrl}/example`
        }
      })
        .its('body')
        .should('have.all.keys', ['access_token', 'expires_in', 'token_type'])
        .then(response => {
          expect(response).to.have.property(
            'access_token',
            'some_authorized_token'
          );
          return response.access_token;
        })
        .then(access_token => {
          cy.request({
            form: true,
            url: 'userinfo',
            method: 'post',
            body: {
              access_token: access_token
            }
          }).then(response => {
            const user = response.body.attributes;
            expect(user).to.have.property('municipalityAgencyId', '790900');
          });
        });
    });
  });
});
