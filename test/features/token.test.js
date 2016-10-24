import LoginPage from '../pageObjects/loginPage';
import {assert} from 'chai';

describe('Test Smaug tokens', () => {
  it('should show forbidden when invalid token', () => {
    LoginPage.open({token: 'invalid_token', returnurl: 'some_url'});
    browser.contains('Forbidden');
  });
});