import Page from './page';
import querystring from 'querystring';
import {assert} from 'chai';

/* eslint-disable no-undef */

export default class LoginPage extends Page {

  constructor() {
    super();
    this.open({token: this.validToken});
  }

  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
  }

  login(provider, token = this.validToken) {
    this.open({token});
    if (provider === 'borchk') {
      // TODO Input actions here to test borchk
    }
    else {
      browser.click(`#${provider}-btn`);
    }
  }

  acceptConsent() {
    browser.click('#consent-action-accept');
  }

  getTicket() {
    const ticketId = browser.getText('#ticketid');
    const ticketToken = browser.getText('#tickettoken');
    assert.isOk(ticketId);
    assert.isOk(ticketToken);
    browser.url(`/getTicket/${ticketToken}/${ticketId}`);
    return JSON.parse(browser.getText('body'));
  }

  validateTicket(hasValues, hasNotElements = []) {
    const ticket = this.getTicket();
    Object.keys(hasValues).forEach(key => {
      assert.deepPropertyVal(ticket, key, hasValues[key], `Ticket contains ${key}`);
    });
    hasNotElements.forEach(element => assert.notDeepProperty(ticket, element, `Ticket does not contain ${element}`));
  }

  loginDirect(token = this.validToken) {
    this.open({token});
  }
}
