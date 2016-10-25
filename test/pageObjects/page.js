/* eslint-disable no-undef */

export default class Page {
  static browser = browser;

  open(path) {
    browser.url('/' + path);
  }

  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}
