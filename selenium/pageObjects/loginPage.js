import Page from './page';
import querystring from 'querystring';

/* eslint-disable no-undef */

export default class LoginPage extends Page {

  constructor() {
    super();
    this.open({token: this.validToken});
  }

  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
  }

  loginWithUNIlogin() {
    this.open({token: this.validToken});
    browser.click('#unilogin-btn');
  }
}
