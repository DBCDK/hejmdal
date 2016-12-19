/* eslint-disable no-undef */
import {assert} from 'chai';

export default class Page {
  validToken = process.env.SMAUG_TOKEN || 'asdfg';

  open(path = '') {
    browser.url('/' + path);
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
}
