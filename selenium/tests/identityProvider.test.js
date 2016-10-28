/* eslint-disable no-undef */
const assert = require('chai').assert;

import LoginPage from '../pageObjects/loginPage';

describe('Test Smaug tokens', () => {
  const loginPage = new LoginPage();

  it('should login user with UNIlogin', () => {
    loginPage.loginWithUNIlogin();
    const session = browser.getSession();
    console.log(session.state);
    assert.deepEqual(session.user, {
      userId: '5555666677',
      userType: 'unilogin',
      identityProviders: ['unilogin']
    });
  });
});
