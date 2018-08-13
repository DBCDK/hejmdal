/* eslint-disable */
/**
 * @file
 * Mainly testing the consent page. When the flow is finished a consent will be stored in memory on the testuser
 * (5555666677).
 * Therefore from this testsuite and onwards the give-/reject-consent page will be skipped.
 */
import {assert} from 'chai';

import LoginPage from '../pageObjects/loginPage';

describe('Test Consent part of authetication flow', () => {
  let loginPage = null;
  let serviceClient = null;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.login('unilogin');
  });

  afterEach(() => {
   browser.deleteCookie();
   browser.wipeStores();
  });

  it('should send user to generic logout screen', () => {
    browser.url('/logout');

    const content = browser.getText('.h3');
    const expected = "Du er logget ud";
    assert.equal(content, expected);
  });

  it('should send user to serviceclient specific logout screen', () => {
    browser.url(`/logout/?token=${loginPage.validToken}`);
    
    // Test returnlink.
    const returnLink = browser.element('#returnUrl');
    assert.equal(returnLink.getText(), 'Tilbage til Test Service');
    assert.equal(returnLink.getAttribute('href'), 'http://localhost:3011/example/');

    // Test ipd info is present.
    assert.equal(browser.getText('.ipdinfo'), 'Du kan stadig være logget ind på de sider, hvor du har benyttet Bibliotekslogin.');


  });

  it('should clear session after logout', () => {
    // Check if session is set.
    let session = browser.getSession();
    assert.isTrue(session.user.identityProviders.includes('unilogin'));
    
    // Test if session is cleared after logout.
    browser.url(`/logout/?token=${loginPage.validToken}`);
    session = browser.getSession();
    assert.isNull(session);
  });
});
