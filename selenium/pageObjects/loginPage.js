import Page from './page';
import querystring from 'querystring';

/* eslint-disable no-undef */

export default class LoginPage extends Page {
  validToken = 'valid_token';

  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
    browser.refresh();
  }

  loginWithUNIlogin() {
    this.open({token: this.validToken});
    browser.refresh();
    browser.click('#unilogin-btn');
  }
}
