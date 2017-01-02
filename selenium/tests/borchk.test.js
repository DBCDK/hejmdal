/* eslint-disable no-undef */
/**
 * @file
 * Testing the Borchk component shown on /login
 */

import {assert} from 'chai';

import LoginPage from '../pageObjects/loginPage';

describe('Test Borchk component', () => {
  let loginPage; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    loginPage = new LoginPage();
  });
  it('should login using borchk', () => {
    browser.url(browser.getUrl() + '&agency=743001');
    browser.setValue('#userid-input', '87654321');
    browser.setValue('#pin-input', '1234');
    browser.click('#borchk-submit');
    assert.isNotNull(loginPage.getTicket().id);
    browser.deleteCookie();
  });


  it('should display the borchk login form and elements', () => {
    assert.isTrue(browser.isVisible('#borchk'));
    assert.isTrue(browser.isVisible('#libraryname-input'));
    assert.isFalse(browser.isVisible('#libraryid-input-hidden'));
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
    assert.isTrue(browser.isVisible('#userid-input'));
    assert.isTrue(browser.isVisible('#pin-input'));
    assert.isTrue(browser.isVisible('#borchk-submit'));

  });

  it('should display dropdown when inputfield has two or more characters', () => {
    browser.addValue('#libraryname-input', 'r');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));

    browser.addValue('#libraryname-input', 'i');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));

    browser.addValue('#libraryname-input', 'n');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));
  });

  it('should display two out of three options', () => {
    browser.addValue('#libraryname-input', 'rin');
    const agencies = browser.elements('.agency');
    assert.equal(agencies.value.length, 3, 'A total of 3 agencies is present in the dropdown');

    let visible = 0;
    let hidden = 0;
    // Iterate through the agenices in the dropdown and count visible/hidden items
    agencies.value.forEach((element) => {
      const isVisible = browser.elementIdDisplayed(element.ELEMENT).value;
      if (isVisible) {
        visible++;
      }
      else {
        hidden++;
      }
    });

    assert.equal(visible, 2);
    assert.equal(hidden, 1);
  });

  it('Should toggle the libraries button open/closed', () => {
    // libraries dropdown should be invisible
    assert.isFalse(browser.isVisible('#libraries-dropdown'));

    browser.click('#libraries-dropdown-toggle-btn');

    // libraries dropdown should now be visible
    assert.isTrue(browser.isVisible('#libraries-dropdown'));

    // Clicking the dropdown-toggle button again should hide the dropdown
    browser.click('#libraries-dropdown-toggle-btn');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
  });

  it('Should toggle visibilty of the buttons next to the library input field', () => {
    assert.isTrue(browser.isVisible('#libraries-dropdown-toggle-btn'));
    assert.isFalse(browser.isVisible('#clear-libraries-input-btn'));

    browser.addValue('#libraryname-input', 'rin');

    assert.isFalse(browser.isVisible('#libraries-dropdown-toggle-btn'));
    assert.isTrue(browser.isVisible('#clear-libraries-input-btn'));
  });

  it('Should empty the libraries input field when clicked', () => {
    assert.equal('', browser.getValue('#libraryname-input'), 'input field is empty');
    browser.addValue('#libraryname-input', 'rin');

    assert.equal('rin', browser.getValue('#libraryname-input'));

    browser.click('#clear-libraries-input-btn');
    assert.equal('', browser.getValue('#libraryname-input'), 'input field is empty');
  });

  it('Should switch type on userid input field', () => {
    assert.equal(browser.getAttribute('#userid-input', 'type'), 'tel');
    browser.click('#toggle-userid-input');
    assert.equal(browser.getAttribute('#userid-input', 'type'), 'password');
    browser.click('#toggle-userid-input');
    assert.equal(browser.getAttribute('#userid-input', 'type'), 'tel');
  });

  it('Should switch type on pin input field', () => {
    assert.equal(browser.getAttribute('#pin-input', 'type'), 'password');
    browser.click('#toggle-pin-input');
    assert.equal(browser.getAttribute('#pin-input', 'type'), 'tel');
    browser.click('#toggle-pin-input');
    assert.equal(browser.getAttribute('#pin-input', 'type'), 'password');
  });

  it('Should display X when a library in the dropdown is clicked', () => {
    browser.click('#libraries-dropdown-toggle-btn');
    browser.click('.agency');

    assert.isFalse(browser.isVisible('#libraries-dropdown-toggle-btn'));
    assert.isTrue(browser.isVisible('#clear-libraries-input-btn'));
  });

  it('should be possible to search libraries using branchId', () => {
    browser.addValue('#libraryname-input', '743001');

    browser.isVisible('=Ringe Bibliotek - Faaborg-Midtfyn Bibliotekerne');
    browser.click('=Ringe Bibliotek - Faaborg-Midtfyn Bibliotekerne');

    assert.equal('Ringe Bibliotek - Faaborg-Midtfyn Bibliotekerne', browser.getValue('#libraryname-input'));
  });

  it('Should display a pre-filled disabled field when &agency= is set', () => {
    browser.url(browser.getUrl() + '&agency=743001');
    assert.isFalse(browser.isVisible('#libraryid-input'));
    assert.isFalse(browser.isVisible('#libraryname-input'));
    assert.isFalse(browser.isEnabled('#libraryid-input-disabled'));
    assert.equal(browser.getValue('#libraryid-input-disabled'), 'Ringe Bibliotek - Faaborg-Midtfyn Bibliotekerne');
  });

  it('Should close dropwdown when a click happens outside the dropdown', () => {
    browser.addValue('#libraryname-input', 'rin');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));
    browser.click('body');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
  });

  it('Should redirect back to serviceclient when "Fortryd log ind" is clicked', () => {
    browser.click('#cancel-login');
    assert.equal(browser.getUrl(), 'http://localhost:3011/');
  });

  it('Should preselect an editable library', () => {
    loginPage.open({token: loginPage.validToken, presel: '743001'});

    assert.equal('Ringe Bibliotek - Faaborg-Midtfyn Bibliotekerne', browser.getValue('#libraryname-input'));
    assert.isFalse(browser.isVisible('#libraries-dropdown-toggle-btn'));
    assert.isTrue(browser.isVisible('#clear-libraries-input-btn'));
  });
});
