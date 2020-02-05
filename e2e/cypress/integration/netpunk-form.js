context('Netpunkt form', () => {
  const serviceUrl = `${Cypress.config().baseUrl}/example`;
  const authorize = `/oauth/authorize?response_type=code&client_id=netpunkt&redirect_uri=${serviceUrl}`;

  beforeEach(() => {
    cy.visit(authorize);
  });

  it('Should switch type on password input field', () => {
    cy.get('#pass-input').type('12345678');
    cy.get('#pass-input').should('have.attr', 'type', 'password');
    cy.get('#toggle-pass-input').click();
    cy.get('#pass-input').should('have.attr', 'type', 'text');
    cy.get('#pass-input').should('have.value', '12345678');
  });

  it('Should validate forms', () => {
    // Assert validation errors
    cy.get('#netpunkt-submit').click();

    cy.get('#group-input-text').should('contain', 'Feltet skal udfyldes');
    cy.get('#user-input-text').should('contain', 'Feltet skal udfyldes');
    cy.get('#pass-input-text').should('contain', 'Feltet skal udfyldes');

    // should throw validation error
    cy.get('#group-input').type('12{enter}');
    cy.get('#group-input-text').should(
      'contain',
      'Indtast et gyldigt gruppe id'
    );

    // Should accept 6 char. code with leading DK-
    cy.get('#group-input').clear();
    cy.get('#group-input').type('DK-123456{enter}');
    cy.get('#group-input-text').should(
      'not.contain',
      'Indtast et gyldigt gruppe id'
    );

    // Should accept 6 char. code
    cy.get('#group-input').clear();
    cy.get('#group-input').type('123456{enter}');
    cy.get('#group-input-text').should(
      'not.contain',
      'Indtast et gyldigt gruppe id'
    );

    // remove validation error from user field
    cy.get('#user-input').clear();
    cy.get('#user-input').type('123456abc{enter}');
    cy.get('#user-input-text').should('not.contain', 'Feltet skal udfyldes');

    // remove validation error from password field
    cy.get('#pass-input').clear();
    cy.get('#pass-input').type('123456abc{enter}');
    cy.get('#pass-input-text').should('not.contain', 'Feltet skal udfyldes');
  });

  it('Should return error message if user is not recognized in forsrights', () => {
    cy.get('#group-input').type('100200');
    cy.get('#user-input').type('invalid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.get('#error-body').should(
      'contain',
      'Det ser ud til at oplysningerne ikke er rigtige'
    );
  });

  it('Should login user if recognized in forsrights', () => {
    cy.get('#group-input').type('100200');
    cy.get('#user-input').type('valid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.location().should(loc => {
      expect(loc.search).to.contain('?code');
    });
  });

  it('Expect to get netpunktAgency exchanged for access_token', () => {
    cy.get('#group-input').type('100200');
    cy.get('#user-input').type('valid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.location('search').then(value => {
      var urlParams = new URLSearchParams(value);
      const code = urlParams.get('code');

      cy.request({
        form: true,
        url: 'oauth/token',
        method: 'post',
        auth: {
          user: 'netpunkt',
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
          }).should(response => {
            expect(response.body.attributes).to.have.property(
              'netpunktAgency',
              '100200'
            );
          });
        });
    });
  });

  it('Expect to get forsrights `rights` exchanged for access_token and agency', () => {
    cy.get('#group-input').type('100200');
    cy.get('#user-input').type('valid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.location('search').then(value => {
      var urlParams = new URLSearchParams(value);
      const code = urlParams.get('code');

      cy.request({
        form: true,
        url: 'oauth/token',
        method: 'post',
        auth: {
          user: 'netpunkt',
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
          }).should(response => {
            expect(response.body.attributes).to.have.property('forsrights');
            expect(response.body.attributes.forsrights[0]).to.have.property(
              'agencyId',
              '100200'
            );
            expect(response.body.attributes.forsrights[0]).to.have.property(
              'rights'
            );
            expect(response.body.attributes.forsrights[0].rights)
              .to.be.a('array')
              .lengthOf(3);
          });
        });
    });
  });

  it('Expect no errors if emty rights retrived from forsrights', () => {
    cy.get('#group-input').type('100300');
    cy.get('#user-input').type('valid-user');
    cy.get('#pass-input').type('123456');
    cy.get('#netpunkt-submit').click();

    cy.location('search').then(value => {
      var urlParams = new URLSearchParams(value);
      const code = urlParams.get('code');

      cy.request({
        form: true,
        url: 'oauth/token',
        method: 'post',
        auth: {
          user: 'netpunkt',
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
          }).should(response => {
            expect(response.body.attributes).to.have.property('forsrights');
            expect(response.body.attributes.forsrights[0]).to.have.property(
              'agencyId',
              '100300'
            );
            expect(response.body.attributes.forsrights[0]).to.have.property(
              'rights'
            );
            expect(response.body.attributes.forsrights[0].rights)
              .to.be.a('array')
              .lengthOf(0);
          });
        });
    });
  });
});
