/* eslint-disable no-undef */

export default class Page {
  validToken = process.env.SMAUG_TOKEN || 'asdfg';

  open(path = '') {
    browser.url('/' + path);
  }
}
