context('Create Account flow', () => {
  const authorize = (agencyId = 733000) =>
    `/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=${
      Cypress.config().baseUrl
    }/example&presel=${agencyId}`;

  it('should create user in culr', () => {
    cy.visit('/example');
    cy.get('#input-login-client').clear().type('hejmdal');
    cy.get('#login-button').click();

    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .clear()
      .type('sla{enter}');
    cy.get('#userid-input').type('0101011234');
    cy.get('#pin-input').type('1234');
    cy.get('#borchk-submit').click();
    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });
  });

  it('should add library to user in culr', () => {
    cy.visit(authorize(100400));
    cy.get('#userid-input').type('0101011234');
    cy.get('#pin-input').type('1111');
    cy.get('#borchk-submit').click();
    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();

    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes.agencies).to.deep.equal([
        {
          agencyId: '790900',
          userId: '0101011234',
          userIdType: 'CPR'
        },
        {
          agencyId: '100400',
          userId: '0101011234',
          userIdType: 'CPR'
        }
      ]);
    });
  });

  it('should create user in culr with userId', () => {
    cy.visit('/example');
    cy.get('#input-login-client').clear().type('hejmdal');
    cy.get('#login-button').click();

    cy.get('#borchk-dropdown [data-cy=libraryname-input]')
      .clear()
      .type('100400{enter}');
    cy.get('#userid-input').type('9999999');
    cy.get('#pin-input').type('1111');
    cy.get('#borchk-submit').click();
    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();
    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes).to.have.property('uniqueId');
    });
  });

  it('should create user from DBC test in culr with userId', () => {
    cy.visit(authorize(790900));
    cy.get('#userid-input').type('9999998');
    cy.get('#pin-input').type('1111');
    cy.get('#borchk-submit').click();
    cy.get('#get-ticket-button').click();
    cy.get('#get-userinfo-button').click();

    cy.get('[data-bind="userinfo"]').invoke('text', (err, text) => {
      const token = JSON.parse(text);
      expect(token).to.have.property('attributes');
      expect(token.attributes.agencies).to.deep.equal([
        {
          agencyId: '790900',
          userId: '9999998',
          userIdType: 'LOCAL'
        }
      ]);
    });
  });
});
