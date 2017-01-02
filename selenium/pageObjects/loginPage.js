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

  login(provider, token = this.validToken, qs = {}) {
    this.open(Object.assign(qs, {token}));
    if (provider === 'borchk') {
      // TODO Input actions here to test borchk
    }
    else {
      browser.click(`#${provider}-btn`);
    }
  }

  loginDirect(token = this.validToken) {
    this.open({token});
  }
}
