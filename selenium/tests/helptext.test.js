/* eslint-disable no-undef */
/**
 * @file
 * Testing the helptext functionality
 */

import {assert} from 'chai';
import LoginPage from '../pageObjects/loginPage';

describe('Testing the helptext functionality', () => {
  let loginpage;

  beforeEach(() => {
    loginpage = new LoginPage();
  });

  it('Assert true is true', () => {
    assert.isFalse(browser.isVisible('#helpModal'));
    browser.click('#helptext-link');
    browser.waitForVisible('#helpModal', 600);
    assert.isTrue(browser.isVisible('#helpModal'));
  });

  it('Assert true is true', () => {
    loginpage.open({token: loginpage.validToken, error: 'unknown_error'});
    assert.isFalse(browser.isVisible('#helpModal'));
    browser.element('#error-overlay').click('#helptext-link');
    browser.waitForVisible('#helpModal', 600);
    assert.isTrue(browser.isVisible('#helpModal'));
  });
});
