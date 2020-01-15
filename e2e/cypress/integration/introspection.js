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

  it('should get access_token from url (as fallback) - no body', () => {
    cy.request({
      method: 'POST',
      url: `${url}?access_token=`
    })
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
        access_token: 'some_invalid_token'
      },
      headers: {
        authorization: 'Basic: im-all-authorized'
      }
    }).then(response => {
      expect(response.body).to.have.property('active', false);
    });
  });

  it('should get introspection info from anonymous token', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_anonymous_token'
      },
      headers: {
        authorization: 'Basic: im-all-authorized'
      }
    }).should(response => {
      expect(response.body).to.have.property('active', true);
      expect(response.body).to.have.property('clientId');
      expect(response.body).to.have.property('expires');
      expect(response.body).to.have.property('uniqueId', null);
      expect(response.body).to.have.property('type', 'anonymous');
    });
  });

  it('should get introspection info from authorized token', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_authorized_token'
      },
      headers: {
        authorization: 'Basic: im-all-authorized'
      }
    }).should(response => {
      expect(response.body).to.have.property('active', true);
      expect(response.body).to.have.property('clientId');
      expect(response.body).to.have.property('expires');
      expect(response.body).to.have.property('uniqueId', 'qwerty');
      expect(response.body).to.have.property('type', 'authorized');
    });
  });
});
