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

  it('should select current selected element, close dropdown and focus next input field when tab is pressed', () => {
    browser.addValue('#libraryid-input', 'rin');

    // Pressing ArrowDown key -- https://github.com/webdriverio/webdriverio/blob/master/lib/helpers/constants.js#L67
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

    // Pressing ArrowDown key -- https://github.com/webdriverio/webdriverio/blob/master/lib/helpers/constants.js#L67
    browser.keys('\uE015');

    // Get text of currently selected item in dropdrown
    const selectedElementText = browser.element('.selected').getText();

    // Pressing Enter key
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
    // Pressing escape key -- https://github.com/webdriverio/webdriverio/blob/master/lib/helpers/constants.js#L67
    browser.keys('\uE00C');
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
    browser.keys(['\uE015', '\uE007']);

    // We should now have one item with the .recent class set
    assert.equal(browser.elements('.recent').value.length, 1);

    browser.setValue('#libraryid-input', '');
    browser.addValue('#libraryid-input', 'rin');

    // Ensure the two labels in the dropdown are now visible
    assert.isTrue(browser.isVisible('#latest'));
    assert.isTrue(browser.isVisible('#alphabetical'));

    // ArrowDown ArrowDown ArrowDown Enter
    browser.keys(['\uE015', '\uE015', '\uE015', '\uE007']);

    browser.setValue('#libraryid-input', '');
    browser.addValue('#libraryid-input', 'rin');

    // We should now have one item with the .recent class set
    assert.equal(browser.elements('.recent').value.length, 2);
  });
});
