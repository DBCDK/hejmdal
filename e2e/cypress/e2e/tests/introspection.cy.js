context('Introspection', () => {
  const url = '/oauth/introspection';

  it('should get error `missing access_token`', () => {
    cy.request({method: 'POST', url})
      .its('body.error')
      .should('include', 'Missing param access_token');
  });

  it('should get error `Invalid client and/or secret`', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_token'
      },
      headers: {
        // authorization: 'Basic: im-not-authorized:client_secret'
        authorization: `Basic ${Buffer.from(
          'im-not-authorized:client_secret'
        ).toString('base64')}`
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
        // authorization: 'Basic: im-authorized-but-not-allowed-to-access-introspection'
        authorization: `Basic ${Buffer.from(
          'im-authorized-but-not-allowed-to-access-introspection:client_secret'
        ).toString('base64')}`
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
        // authorization: 'Basic: im-all-authorized'
        authorization: `Basic ${Buffer.from(
          'im-all-authorized:client_secret'
        ).toString('base64')}`
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
        // authorization: 'Basic: im-all-authorized'
        authorization: `Basic ${Buffer.from(
          'im-all-authorized:client_secret'
        ).toString('base64')}`
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
        // authorization: 'Basic: im-all-authorized'
        authorization: `Basic ${Buffer.from(
          'im-all-authorized:client_secret'
        ).toString('base64')}`
      }
    }).should(response => {
      expect(response.body).to.have.property('active', true);
      expect(response.body).to.have.property('clientId');
      expect(response.body).to.have.property('expires');
      expect(response.body).to.have.property('agency', 'some_agency');
      expect(response.body).to.have.property('search');
      expect(response.body).to.have.property(
        'uniqueId',
        'some_authorized_user_id'
      );
      expect(response.body).to.have.property('type', 'authorized');
    });
  });

  it('should get introspection info from authorized token - Param from url (fallback)', () => {
    cy.request({
      method: 'POST',
      url: `${url}?access_token=some_authorized_token`,
      headers: {
        // authorization: 'Basic: im-all-authorized'
        authorization: `Basic ${Buffer.from(
          'im-all-authorized:client_secret'
        ).toString('base64')}`
      }
    }).should(response => {
      expect(response.body).to.have.property('active', true);
      expect(response.body).to.have.property('clientId');
      expect(response.body).to.have.property('expires');
      expect(response.body).to.have.property('agency', 'some_agency');
      expect(response.body).to.have.property('search');
      expect(response.body).to.have.property(
        'uniqueId',
        'some_authorized_user_id'
      );
      expect(response.body).to.have.property('type', 'authorized');
    });
  });

  it('should get introspection info containing client metadata', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        access_token: 'some_authorized_token'
      },
      headers: {
        // authorization: 'Basic: im-all-authorized'
        authorization: `Basic ${Buffer.from(
          'im-all-authorized:client_secret'
        ).toString('base64')}`
      }
    }).should(response => {
      expect(response.body).to.have.property('active', true);
      expect(response.body).to.have.property('clientId');
      expect(response.body).to.have.property('expires');
      expect(response.body).to.have.property(
        'uniqueId',
        'some_authorized_user_id'
      );
      expect(response.body).to.have.property('agency', 'some_agency');
      expect(response.body).to.have.property('name', 'some_client_name');
      expect(response.body).to.have.property('search');
      expect(response.body).to.have.property('contact');
    });
  });
});
