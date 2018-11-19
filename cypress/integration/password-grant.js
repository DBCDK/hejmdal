context('Password grant', () => {
  it('should return valid token', () => {
    cy.request({
      form: true,
      url: 'oauth/token',
      method: 'post',
      body: {
        grant_type: 'password',
        username: '5555666677',
        password: '1234',
        agency: '724000',
        client_id: 'hejmdal',
        client_secret: 'test'
      }
    })
      .its('body')
      .should('have.all.keys', [
        'access_token',
        'expires_in',
        'refresh_token',
        'token_type'
      ]);
  });
  it('should return invalid client error', () => {
    cy.request({
      form: true,
      url: 'oauth/token',
      method: 'post',
      failOnStatusCode: false,
      body: {
        grant_type: 'password',
        username: 'wrong_user',
        password: 'wrong',
        agency: '724000',
        client_id: 'fisk',
        client_secret: 'test'
      }
    })
      .its('body.error_description')
      .should('include', 'client is invalid');
  });
  it('should return invalid user error', () => {
    cy.request({
      form: true,
      url: 'oauth/token',
      method: 'post',
      failOnStatusCode: false,
      body: {
        grant_type: 'password',
        username: 'wrong_user',
        password: 'wrong',
        agency: '724000',
        client_id: 'hejmdal',
        client_secret: 'test'
      }
    })
      .its('body')
      .should('include.keys', ['error', 'error_description'])
      .its('error_description')
      .should('include', 'user credentials are invalid');
  });
  it('should return user information', () => {
    cy.request({
      form: true,
      url: 'oauth/token',
      method: 'post',
      body: {
        grant_type: 'password',
        username: '5555666677',
        password: '1234',
        agency: '724000',
        client_id: 'hejmdal',
        client_secret: 'test'
      }
    }).then(res => {
      const {access_token} = res.body;
      cy.request({
        form: false,
        method: 'post',
        url: 'userinfo',
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
        .its('body')
        .its('attributes')
        .its('uniqueId')
        .should('eq', 'some-random-curl-id');
    });
  });
});
