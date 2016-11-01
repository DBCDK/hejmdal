/* eslint-disable no-undef */

export default class Page {
  open(path) {
    browser.url('/' + path);
  }
}
