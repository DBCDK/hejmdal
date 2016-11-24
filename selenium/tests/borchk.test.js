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
  // keydown: https://w3c.github.io/webdriver/webdriver-spec.html#h-keyboard-actions
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
});
