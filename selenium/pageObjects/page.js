/* eslint-disable no-undef */

export default class Page {
  /*constructor(){
    browser.deleteCookie();
  }*/

  open(path) {
    browser.url('/' + path);
  }
}
