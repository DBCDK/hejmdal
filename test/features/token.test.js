/* eslint-disable no-undef */

import LoginPage from '../pageObjects/loginPage';

describe('Test Smaug tokens', () => {
  it('should show forbidden when invalid token', () => {
    LoginPage.open({token: 'invalid_token', returnurl: 'some_url'});
    browser.contains('Forbidden');
  });
});
