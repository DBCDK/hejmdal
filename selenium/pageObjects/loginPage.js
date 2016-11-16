import Page from './page';
import querystring from 'querystring';

/* eslint-disable no-undef */

export default class LoginPage extends Page {
  validToken = 'valid_token';

  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
  }

  loginWithUNIlogin() {
    this.open({token: this.validToken});
    browser.click('#unilogin-btn');
  }
}
