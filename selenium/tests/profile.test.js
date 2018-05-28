/* eslint-disable */
/**
 * @file
 * Testing the profile page, where consents can be viewed and deleted
 */
import {assert, expect} from 'chai';

import LoginPage from '../pageObjects/loginPage';

describe('Test Profile', () => {
  let loginPage = null;
  let serviceClient = null;

  beforeEach(() => {
    loginPage = new LoginPage();
    serviceClient = browser.getState().serviceClient
  });

  afterEach(() => {
    browser.deleteCookie();
    browser.wipeStores();
    // browser.url('/logout');
  });

  it('should send to login page then profile page', () => {
    browser.url('/profile');
    assert.isTrue(browser.getUrl().includes('/login'));
    assert.isTrue(browser.getUrl().endsWith('loginToProfile=1'));
    expect(browser.getText('#profile-login')).to.equal('Log ind for at se dine data');

    loginPage.login('unilogin', 'hejmdal-access-token', {loginToProfile: 1});
    assert.isTrue(browser.getUrl().includes('/profile'));
    assert.isTrue(browser.getText('body').includes('Du har ikke nogen godkendelser'));
  });

  it('should see list of consents, and be able to delete them', () => {
    browser.url('/profile?token=asdfg');
    loginPage.login('unilogin', 'asdfg', {loginToProfile: 1});
    browser.click('#consent-action-accept');
    assert.isTrue(browser.getUrl().includes('/profile'));
    assert.isTrue(browser.getText('body').includes('Du har tidligere godkendt at følgende sider'));
    assert.isTrue(browser.getText('body').includes('Test Service'));
    browser.click('.btn-danger');
    assert.isTrue(browser.getText('body').includes('Er du sikker på, at du vil slette dine godkendelser?'));
    browser.click('.btn-danger');
    assert.isTrue(browser.getText('body').includes('Dine godkendelser er nu slettet og du er logget ud.'));
  });

  it('should show profile page, when cancel delete consents', () => {
    browser.url('/profile?token=asdfg');
    loginPage.login('unilogin', 'asdfg', {loginToProfile: 1});
    browser.click('#consent-action-accept');
    browser.click('.btn-danger');
    assert.isTrue(browser.getText('body').includes('Er du sikker på, at du vil slette dine godkendelser?'));
    browser.click('#cancel-delete-consents a');
    assert.isTrue(browser.getText('body').includes('Du har tidligere godkendt at følgende sider'));
  });

  it('should display no "fortsæt til" link when no token is given', () => {
    browser.url('/profile');
    assert.isTrue(browser.getUrl().endsWith('loginToProfile=1'));
    loginPage.login('unilogin', 'hejmdal-access-token', {loginToProfile: 1});
    assert.isFalse(browser.getText('body').includes('Fortsæt til'));
  });

  it('should redirect to client when clicking "fortsæt til" link', () => {
    browser.url('/profile?token=asdfg');
    loginPage.login('unilogin', 'asdfg', {loginToProfile: 1});
    browser.click('#consent-action-accept');
    browser.click('#proceed-login a');
    assert.isTrue(browser.getUrl().includes('/example'));
  });
});
