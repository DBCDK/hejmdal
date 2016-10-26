import Page from './page';
import querystring from 'querystring';

export default class LoginPage extends Page {
  open(qs) {
    super.open(`login?${querystring.stringify(qs)}`);
  }
}
