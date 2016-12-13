/* eslint-disable */
/**
 * @file
 * Testing the getTicket endpoint
 */
import {assert} from 'chai';

import LoginPage from '../pageObjects/loginPage';
//import DB from '../CustomMethods/db';

describe('Testing the getTicket endpoint', () => {
  let loginPage = null;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.loginWithUNIlogin();
  });

  after(() => {
    browser.deleteCookie();
   browser.wipeStores();
  });

  it('Should deliver er valid ticket', () => {
    // accept consent
    browser.click('#consent-action-accept');

    const ticketToken = browser.getText('#tickettoken');

    assert.isOk(ticketToken);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    browser.url(`/getTicket/${ticketToken}/${ticketId}`);

    const body = browser.getText('body');
    const expectedValidTicket = `{"attributes":{"cpr":null,"birthDate":null,"birthYear":null,"gender":null,"libraries":[],"municipality":null,"uniloginId":"test1234","wayfId":null},"id":${ticketId},"token":"${ticketToken}"}`;

    // ensure the ticket is as expected
    assert.deepEqual(JSON.parse(body), JSON.parse(expectedValidTicket));

    // Going t getTikcet again with the same token and id should give an empty ticket as it now should be deleted

    browser.url(`/getTicket/${ticketToken}/${ticketId}`);

    const body2 = browser.getText('body');
    const expectedValidTicket2 = `{"attributes":null,"id":${ticketId},"token":"${ticketToken}"}`;

    console.log(JSON.parse(body2), JSON.parse(expectedValidTicket2));
    // ensure the ticket is as expected
    assert.deepEqual(JSON.parse(body2), JSON.parse(expectedValidTicket2));
  });
});
