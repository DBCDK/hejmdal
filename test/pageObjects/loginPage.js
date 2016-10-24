import Page from './page';
import querystring from 'querystring'

class LoginPage extends Page {
  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
  }
}

export default new LoginPage();