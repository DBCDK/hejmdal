context('Login flow', () => {
  beforeEach(() => {
    const authorize =
      '/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=http://localhost:3011/example';
    cy.visit(authorize);
    cy.get('#libraryname-input').clear();
  });

  it('test dropdown is visible after 2 keys', () => {
    cy.get('#libraryname-input').type('s');
    cy.get('#libraries-dropdown').should('not.visible');
    cy.get('#libraryname-input').type('l');
    cy.get('#libraries-dropdown').should('visible');
    // Should only show elements containing "sl"
    cy.get('#libraries-dropdown .agency:visible').should('have.length', 3);
    cy.get('#libraries-dropdown .agency:hidden').should('have.length', 2);
  });
  it('Toggle dropdown', () => {
    // Dropdown is hidden
    cy.get('#libraries-dropdown').should('not.be.visible');
    // Toggle on
    cy.get('#libraries-dropdown-toggle-btn').click();
    cy.get('#libraries-dropdown').should('be.visible');
    // Toggle off
    cy.get('#libraries-dropdown-toggle-btn').click();
    cy.get('#libraries-dropdown').should('not.be.visible');
  });
  it('Select library in dropdown', () => {
    cy.get('#libraryname-input').type('sla');
    // Select first library in list with click
    cy.get('.agency:visible')
      .first()
      .click();
    cy.get('#libraryname-input').should('have.value', 'Slagelse Bibliotekerne');
    cy.get('#clear-libraries-input-btn').should('be.visible');
    // Clear selection
    cy.get('#clear-libraries-input-btn').click();
    cy.get('#libraryname-input').should('be.empty');
    // Select using keys
    cy.get('#libraryname-input').type('sla');
    cy.get('#libraryname-input').type('{downarrow}');
    cy.get('#libraryname-input').type('{enter}');
    cy.get('#libraryname-input').should('have.value', 'Slagelse Bibliotekerne');
  });

  it('Toggle clear button', () => {
    cy.get('#libraryname-input').type('sla');
    cy.get('#libraries-dropdown-toggle-btn').should('not.be.visible');
    cy.get('#clear-libraries-input-btn').should('be.visible');
    // Clear input and close dropdown
    cy.get('#clear-libraries-input-btn').click();
    cy.get('#libraryname-input').should('be.empty');
    cy.get('#libraries-dropdown').should('not.be.visible');
  });
  it('Should switch type on userid input field', () => {
    cy.get('#userid-input').type('12345678');
    cy.get('#userid-input').should('have.attr', 'type', 'password');
    cy.get('#toggle-userid-input').click();
    cy.get('#userid-input').should('have.attr', 'type', 'tel');
    cy.get('#userid-input').should('have.value', '12345678');
  });
  it('Should switch type on password input field', () => {
    cy.get('#pin-input').type('1234');
    cy.get('#pin-input').should('have.attr', 'type', 'password');
    cy.get('#toggle-pin-input').click();
    cy.get('#pin-input').should('have.attr', 'type', 'tel');
    cy.get('#pin-input').should('have.value', '1234');
  });
  it.only('Should validate forms', () => {
    // Library input
    cy.get('#borchk-submit').click();
    cy.get('#libraryname-input').should(field => {
      expect(field.get(0).checkValidity()).to.equal(false);
      expect(field.get(0).validationMessage).to.contain(
        'Please fill in this field.'
      );
    });
    // user ID
    cy.get('#libraryname-input').type('733000');
    cy.get('#borchk-submit').click();
    cy.get('#userid-input').should(field => {
      expect(field.get(0).checkValidity()).to.equal(false);
      expect(field.get(0).validationMessage).to.contain(
        'Please fill in this field.'
      );
    });
    // pincode
    cy.get('#userid-input').type('12345678');
    cy.get('#borchk-submit').click();
    cy.get('#pin-input').should(field => {
      expect(field.get(0).checkValidity()).to.equal(false);
      expect(field.get(0).validationMessage).to.contain(
        'Please fill in this field.'
      );
    });
  });
});
