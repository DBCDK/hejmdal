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

  it('should display the borchk login form and elements', () => {
    assert.isTrue(browser.isVisible('#borchk'));
    assert.isTrue(browser.isVisible('#libraryid-input'));
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
    assert.isTrue(browser.isVisible('#userid-input'));
    assert.isTrue(browser.isVisible('#pin-input'));
    assert.isTrue(browser.isVisible('#borchk-submit'));
  });

  it('should display dropdown when inputfield has two or more characters', () => {
    browser.addValue('#libraryid-input', 'r');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));

    browser.addValue('#libraryid-input', 'i');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));

    browser.addValue('#libraryid-input', 'n');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));
  });

  it('should display two out of four options', () => {
    browser.addValue('#libraryid-input', 'rin');
    const agencies = browser.elements('.agency');
    assert.equal(agencies.value.length, 4, 'A total of 4 agencies is present in the dropdown');

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
    assert.equal(hidden, 2);
  });

  it('should select current selected element, close dropdown and focus next input field when tab is pressed', () => {
    browser.addValue('#libraryid-input', 'rin');

    // Pressing ArrowDown key -- https://w3c.github.io/webdriver/webdriver-spec.html#h-keyboard-actions
    browser.keys('ArrowDown');

    // Get text of currently selected item in dropdrown
    const selectedElementText = browser.element('.selected').getText();

    // Pressing Tab key
    browser.keys('Tab');

    // Get value of library input field
    const inputValue = browser.element('#libraryid-input').getValue();

    assert.equal(selectedElementText, inputValue);

    // Assert that the userid input field have focus
    assert.isTrue(browser.hasFocus('#userid-input'));
  });

  it('should select current selected element, close dropdown and focus next input field when enter is pressed', () => {
    browser.addValue('#libraryid-input', 'rin');

    // Pressing ArrowDown key -- https://w3c.github.io/webdriver/webdriver-spec.html#h-keyboard-actions
    browser.keys('ArrowDown');

    // Get text of currently selected item in dropdrown
    const selectedElementText = browser.element('.selected').getText();

    // Pressing Enter key
    browser.keys('Enter');

    // Get value of library input field
    const inputValue = browser.element('#libraryid-input').getValue();

    assert.equal(selectedElementText, inputValue);

    // Assert that the userid input field have focus
    assert.isTrue(browser.hasFocus('#userid-input'));
  });

  it('should close dropwdown on escape', () => {
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
    browser.addValue('#libraryid-input', 'rin');
    assert.isTrue(browser.isVisible('#libraries-dropdown'));
    // Pressing escape key -- https://w3c.github.io/webdriver/webdriver-spec.html#h-keyboard-actions
    browser.keys('Escape');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
  });

  it('should add selected items to "Forslag"', () => {
    // Empty localStorage
    browser.localStorage('DELETE', 'agencies');
    // Refresh browser to make it take effect
    browser.refresh();

    browser.addValue('#libraryid-input', 'rin');

    // Ensure the two labels in the dropdown are hidden
    assert.isFalse(browser.isVisible('#latest'));
    assert.isFalse(browser.isVisible('#alphabetical'));


    // Select first item in dropdown -- ArrowDown Enter
    browser.keys(['ArrowDown', 'Enter']);

    // We should now have one item with the .recent class set
    assert.equal(browser.elements('.recent').value.length, 1);

    browser.setValue('#libraryid-input', '');
    browser.addValue('#libraryid-input', 'rin');

    // Ensure the two labels in the dropdown are now visible
    assert.isTrue(browser.isVisible('#latest'));
    assert.isTrue(browser.isVisible('#alphabetical'));

    // ArrowDown ArrowDown ArrowDown Enter
    browser.keys(['ArrowDown', 'ArrowDown', 'ArrowDown', 'Enter']);

    browser.setValue('#libraryid-input', '');
    browser.addValue('#libraryid-input', 'rin');

    // We should now have one item with the .recent class set
    assert.equal(browser.elements('.recent').value.length, 2);
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

    browser.addValue('#libraryid-input', 'rin');

    assert.isFalse(browser.isVisible('#libraries-dropdown-toggle-btn'));
    assert.isTrue(browser.isVisible('#clear-libraries-input-btn'));
  });

  it('Should empty the libraries input field when clicked', () => {
    assert.equal('', browser.getValue('#libraryid-input'), 'input field is empty');
    browser.addValue('#libraryid-input', 'rin');

    assert.equal('rin', browser.getValue('#libraryid-input'));

    browser.click('#clear-libraries-input-btn');
    assert.equal('', browser.getValue('#libraryid-input'), 'input field is empty');
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
});
