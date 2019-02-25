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

  it('should revoke access_token', () => {
    const access_token = '1-123456789';

    cy.request({
      form: false,
      url: `oauth/revoke/?access_token=${access_token}`,
      method: 'delete'
    })
      .its('body.count')
      .should('eq', 1);
  });

  it('should NOT be able to revoke access_token', () => {
    const access_token = '0-123456789';

    cy.request({
      form: false,
      url: `oauth/revoke/?access_token=${access_token}`,
      method: 'delete'
    })
      .its('body.count')
      .should('not.eq', 1);
  });

  it('should fail on missing token', () => {
    cy.request({
      form: false,
      url: `oauth/revoke/`,
      method: 'delete'
    })
      .its('body.error')
      .should('include', 'no valid access_token');
  });
});
