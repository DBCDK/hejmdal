/* eslint-disable */
/**
 * @file
 * Testing the getTicket endpoint
 */
import {assert} from 'chai';

import LoginPage from '../pageObjects/loginPage';

describe('Testing the getTicket endpoint', () => {
  let loginPage = null;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.loginWithUNIlogin();
  });

  after(() => {
    browser.deleteCookie();
    browser.url('/wipestores');
  });

  it('Should deliver er valid ticket', () => {
    // accept consent
    browser.click('#consent-actions-accept');

    const ticketToken = browser.getText('#tickettoken');
    assert.isOk(ticketToken);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    browser.url(`/getTicket/${ticketToken}/${ticketId}`);

    const body = browser.getText('body');
    const expectedValidTicket = `{"attributes":{"cpr":null,"birthDate":null,"birthYear":null,"gender":null,"libraries":[],"municipality":null,"uniloginId":"test1234"},"id":${ticketId},"token":"${ticketToken}"}`;

    // ensure the ticket is as expected
    assert.equal(body, expectedValidTicket);

    // Going t getTikcet again with the same token and id should give an empty ticket as it now should be deleted

    browser.url(`/getTicket/${ticketToken}/${ticketId}`);

    const body2 = browser.getText('body');
    const expectedValidTicket2 = `{"attributes":false,"id":${ticketId},"token":"${ticketToken}"}`;

    // ensure the ticket is as expected
    assert.equal(body2, expectedValidTicket2);
  });
});
