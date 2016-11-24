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

  it('shuld display two out of four options', () => {
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
    browser.keys('\uE015');

    // Get text of currently selected item in dropdrown
    const selectedElementText = browser.element('.selected').getText();

    // Pressing Tab key
    browser.keys('\uE004');

    // Get value of library input field
    const inputValue = browser.element('#libraryid-input').getValue();

    assert.equal(selectedElementText, inputValue);

    // Assert that the userid input field have focus
    assert.isTrue(browser.hasFocus('#userid-input'));
  });

  it('should select current selected element, close dropdown and focus next input field when enter is pressed', () => {
    browser.addValue('#libraryid-input', 'rin');

    // Pressing ArrowDown key -- https://w3c.github.io/webdriver/webdriver-spec.html#h-keyboard-actions
    browser.keys('\uE015');

    // Get text of currently selected item in dropdrown
    const selectedElementText = browser.element('.selected').getText();

    // Pressing Tab key
    browser.keys('\uE007');

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
    browser.keys('\uE00C');
    assert.isFalse(browser.isVisible('#libraries-dropdown'));
  });
});
