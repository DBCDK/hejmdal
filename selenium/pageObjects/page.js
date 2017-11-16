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

  validateTicketAttributes(hasValues, hasNotElements = []) {
    const attributes = this.getTicket().attributes;
    Object.keys(hasValues).forEach(key => {
      assert.deepPropertyVal(attributes, key, hasValues[key], `Ticket attributes contains ${key}`);
    });
    hasNotElements.forEach(element => assert.notDeepPropertyVal(attributes, element, `Ticket attributes does not contain ${element}`));
  }
}
