context('Introspection', () => {
  const url = '/oauth/introspection';

  it('should get error `missing access_token`', () => {
    cy.request({method: 'POST', url})
      .its('body.error')
      .should('include', 'Missing param access_token');
  });

  it('should get error `empty value access_token`', () => {
    cy.request({method: 'POST', url, body: {access_token: ''}})
      .its('body.error')
      .should('include', 'Empty value access_token');
  });

  it('should get error `Invalid client and/or secret`', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_token'
      },
      headers: {
        authorization: 'Basic: im-not-authorized'
      }
    })
      .its('body.error')
      .should('include', 'Invalid client and/or secret');
  });

  it('should get error `Client is not allowed to use /introspection endpoint`', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_token'
      },
      headers: {
        authorization:
          'Basic: im-authorized-but-not-allowed-to-access-introspection'
      }
    })
      .its('body.error')
      .should(
        'include',
        'Client is not allowed to use /introspection endpoint'
      );
  });

  it('should get introspection response from invalid (expired) token', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'invalid_access_token'
      },
      headers: {
        authorization: 'Basic: im-all-authorized'
      }
    }).then(response => {
      expect(response.body).to.have.property('active', false);
    });
  });

  it.skip('should get introspection info from anonymous token', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'valid_access_token'
      },
      headers: {
        authorization: 'Basic: im-authorized'
      }
    }).should(res => {
      console.log('res', res);
    });
  });
});
