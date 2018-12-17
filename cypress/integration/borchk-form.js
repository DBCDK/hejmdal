context('Borchk form', () => {
  beforeEach(() => {
    const authorize =
      '/oauth/authorize?response_type=code&client_id=hejmdal&redirect_uri=http://localhost:3011/example';
    cy.visit(authorize);
    //cy.get('#libraryname-input').clear();
    //cy.get('#libraryname-input').blur();
  });

  it('test dropdown is available on focus', () => {
    cy.get('#libraryname-input').focus();
    cy.get('#libraries-dropdown-container').should('have.class', 'visible');
  });
  it('Toggle dropdown', () => {
    // Dropdown is hidden
    cy.get('#libraries-dropdown-container').should('not.have.class', 'visible');
    // Toggle on
    cy.get('#libraries-dropdown-toggle-btn').click();
    cy.get('#libraries-dropdown-container').should('have.class', 'visible');
    // Toggle off
    cy.get('#login').click('topLeft');
    cy.get('#libraries-dropdown-container').should('not.have.class', 'visible');
  });
  it('Select library in dropdown', () => {
    cy.get('#libraryname-input').type('sla');
    // Select first library in list with click
    cy.get('.agency:visible')
      .first()
      .click();
    cy.get('#libraryname-input').should('have.value', 'Slagelse');
    cy.get('#clear-libraries-input-btn').should('be.visible');
    // Clear selection
    cy.get('#clear-libraries-input-btn').click();
    cy.get('#libraryname-input').should('be.empty');
    // Select using keys
    cy.get('#libraryname-input').type('sla');
    cy.get('#libraryname-input').type('{downarrow}');
    cy.get('#libraryname-input').type('{enter}');
    cy.get('#libraryname-input').should('have.value', 'Slagelse');
  });

  it('Toggle clear button', () => {
    cy.get('#libraryname-input').type('sla');
    cy.get('#libraries-dropdown-toggle-btn').should('not.be.visible');
    cy.get('#clear-libraries-input-btn').should('be.visible');
    // Clear input and close dropdown
    cy.get('#clear-libraries-input-btn').click();
    cy.get('#libraryname-input').should('be.empty');
  });
  it('clear library dropdown with escape', () => {
    // Open dropdown with focus in input field
    cy.get('#libraryname-input').type('sla');
    cy.get('#libraries-dropdown-container').should('have.class', 'visible');
    cy.get('#libraryname-input').type('{esc}');
    cy.get('#libraries-dropdown-container').should('not.have.class', 'visible');
    // Open dropdown with toggle button
    cy.get('#libraryname-input').clear();
    cy.get('#libraries-dropdown-toggle-btn').click();
    cy.get('#libraries-dropdown-container').should('have.class', 'visible');
    cy.get('#libraryname-input').type('{esc}');
    cy.get('#libraries-dropdown-container').should('not.have.class', 'visible');
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
  it('Should validate forms', () => {
    // Assert validation errors
    cy.get('#borchk-submit').click();
    cy.get('#libraryname-input-text').should(
      'contain',
      'Du skal vælge et bibliotek'
    );
    cy.get('#userid-input-text').should('contain', 'Du skal angive');
    cy.get('#pin-input-text').should('contain', 'Du skal angive');

    // remove validation error from library name
    cy.get('#libraryname-input').type('733000{enter}');
    cy.get('#borchk-submit').click();
    cy.get('#libraryname-input-text').should(
      'not.contain',
      'Du skal vælge et bibliotek'
    );
    // remove validation error from username
    cy.get('#userid-input').type('12345678{enter}');
    cy.get('#userid-input-text').should(
      'not.contain',
      'Du skal vælge et bibliotek'
    );
    // remove validation error from user pin
    cy.get('#userid-input').clear();
    cy.get('#pin-input').type('12345{enter}');
    cy.get('#pin-input-text').should(
      'not.contain',
      'Du skal vælge et bibliotek'
    );
  });
});
