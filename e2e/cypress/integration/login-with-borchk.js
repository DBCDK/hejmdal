context('Login flow', () => {
  const authorize = (agencyId = 733000) =>
    `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
      Cypress.config().baseUrl
    }/example&presel=${agencyId}`;

  it('should login throught oauth authorization grant', () => {
    cy.log('Setup client using example endpoint');
    cy.visit('example');
    cy.get('h3')
      .first('h3')
      .should('contain', 'Example client for login.bib.dk');

    cy.get('#input-login-client').clear().type('hejmdal');

    cy.get('#input-preselected-library').clear().type('733000');
    cy.get('#input-locked-library').clear();
    cy.get('#login-button').click();

    cy.log('Login user via borchk');
    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .focus()
      .clear()
      .type('733000{downarrow}{downarrow}{enter}');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.location('pathname').should('eq', '/example/');
    cy.location('search').should('contain', 'code');

    cy.log('Get access token');
    cy.hash('ticket');
    cy.get('#get-ticket-button').click();
    cy.get('[data-bind="token"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('access_token');
    });
    cy.hash('userinfo');
    cy.log('Get user info');
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });

    cy.log('Check single signon works');
    cy.visit(authorize());
    cy.location('pathname').should('eq', '/example/');

    cy.log('Log out user');
    cy.get('#logout button').click();
    cy.location('pathname').should('eq', '/logout');

    cy.visit(authorize());
    cy.location('pathname').should('eq', '/login');
  });

  it('Should trim user input', () => {
    cy.visit('/example');
    cy.get('#input-login-client').clear().type('hejmdal');

    cy.get('#input-preselected-library').clear().type('733000');
    cy.get('#input-locked-library').clear();
    cy.get('#login-button').click();
    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .focus()
      .clear()
      .type('733000{downarrow}{downarrow}{enter}');

    cy.get('#userid-input').type(' 87654321');
    cy.get('#pin-input').type('1234');

    cy.get('#borchk-submit').click();

    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const userinfo = JSON.parse(text);
      expect(userinfo.attributes.userId).to.equal('87654321');
    });
  });

  it('carries through state parameter', () => {
    cy.visit(`${authorize()}&state=test-state-string%2F%2F`);
    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .focus()
      .clear()
      .type('733000{downarrow}{downarrow}{enter}');
    cy.get('#userid-input').type('87654321');
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();
    cy.location('search').should('contain', 'state=test-state-string%2F%2F');
  });

  it('should not login with wrong redirect_uri', () => {
    cy.request({
      url: '/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=https://wrong.host/example',
      failOnStatusCode: false
    }).then((res) =>
      cy.wrap(res).its('body.error').should('equal', 'invalid_client')
    );
  });

  it('Should return home-municipality for loaners using libraries outside their home-municipality', () => {
    const municipalityHome = 329;
    const municipalityLoaner = 370;

    // userId home municipality is 329 (Culr);
    const userId = '0102030411';

    cy.visit(authorize(`7${municipalityLoaner}00`));
    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .focus()
      .clear()
      .type('733000{downarrow}{downarrow}{enter}');
    cy.get('#userid-input').type(userId);
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();

    cy.get('#input-login-client').clear().type('hejmdal');

    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();

    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const userinfo = JSON.parse(text);
      expect(userinfo.attributes.userId).to.equal(userId);
      expect(userinfo.attributes.municipality).to.equal(`${municipalityHome}`);
      expect(userinfo.attributes.municipalityAgencyId).to.equal(
        `7${municipalityHome}00`
      );
    });
  });

  it('Should return work-municipality for librarians working outside their home-municipality', () => {
    const municipalityWork = 615;
    const municipalityAgency = 761500;

    const userId = '0102030410';

    cy.visit(authorize(`${municipalityAgency}`));
    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .focus()
      .clear()
      .type('737000{downarrow}{downarrow}{enter}');
    cy.get('#userid-input').type(userId);
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();

    cy.get('#input-login-client').clear().type('hejmdal');

    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();

    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const userinfo = JSON.parse(text);
      expect(userinfo.attributes.userId).to.equal(userId);
      expect(userinfo.attributes.municipality).to.equal(`${municipalityWork}`);
      expect(userinfo.attributes.municipalityAgencyId).to.equal(
        `${municipalityAgency}`
      );
    });
  });
});
