context('Login flow with UNI-login', () => {
  const authorize = `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
    Cypress.config().baseUrl
  }/example&presel=733000`;

  it('Should return uniloginId and uniLoginInstitutions', () => {
    cy.visit(authorize);
    cy.get('#unilogin-btn').click();
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
        .then(values => values['access_token'])
        .then(access_token => {
          cy.request({
            form: true,
            url: 'userinfo',
            method: 'post',
            body: {
              access_token: access_token
            }
          })
            .its('body.attributes')
            .then(({uniloginId, uniLoginInstitutions}) => ({
              uniloginId,
              uniLoginInstitutions
            }))
            .should('deep.equal', {
              uniloginId: 'valid_user_id',
              uniLoginInstitutions: [
                {id: '101DBC', name: 'DANSK BIBLIOTEKSCENTER A/S'},
                {
                  id: 'A03132',
                  name: 'Vejle Bibliotekerne c/o www.pallesgavebod.dk'
                }
              ]
            });
        });
    });
  });
});
