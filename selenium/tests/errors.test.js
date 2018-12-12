/* eslint-disable no-undef */
/**
 * @file
 * Testing the error messages shown to users in the frontend.
 */
import {assert} from 'chai';
import {ERRORS} from '../../src/utils/errors.util';
import LoginPage from '../pageObjects/loginPage';

describe('Testing errors shown in the UI', () => {
  let loginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  it('Should display a error overlay for each of the errors defined in errors.util.js', () => {
    assert.isFalse(browser.isVisible('#error-overlay'));
    Object.keys(ERRORS).forEach((value) => {
      const errorcode = ERRORS[value];
      loginPage.open({token: loginPage.validToken, error: errorcode});
      assert.isTrue(browser.isVisible('#error-overlay'));
    });
  });

  it('Should close the error overlay when upper right X is clicked', () => {
    assert.isFalse(browser.isVisible('#error-overlay'));
    loginPage.open({token: loginPage.validToken, error: ERRORS.missing_fields});
    assert.isTrue(browser.isVisible('#error-overlay'));
    browser.click('#error-overlay-close-btn');
    assert.isFalse(browser.isVisible('#error-overlay'));
  });

  it('Should close the error overlay when Prøv igen button is clicked', () => {
    assert.isFalse(browser.isVisible('#error-overlay'));
    loginPage.open({token: loginPage.validToken, error: ERRORS.missing_fields});
    assert.isTrue(browser.isVisible('#error-overlay'));
    browser.click('#try-again-btn');
    assert.isFalse(browser.isVisible('#error-overlay'));
  });

  it('Should set the presel url parameter', () => {
    browser.addValue('#libraryname-input', 'slagelse');
    browser.click('=Slagelse');

    browser.addValue('#userid-input', '1234');
    browser.addValue('#pin-input', '1234');
    browser.click('#borchk-submit');

    assert.isTrue(browser.getUrl().includes('presel=733000'));
  });

  it('should open a generic error page', () => {
    browser.addValue('#libraryname-input', 'slagelse');
    browser.click('=Slagelse');

    browser.addValue('#userid-input', '1234');
    browser.addValue('#pin-input', '1234');
    browser.click('#borchk-submit');

    assert.isTrue(browser.getUrl().includes('presel=733000'));
  });
});
