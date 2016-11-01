/* eslint-disable no-undef */
import LoginPage from '../pageObjects/loginPage';

describe('Test Smaug tokens', () => {
  const loginPage = new LoginPage();

  it('should login user with UNIlogin', () => {
    loginPage.loginWithUNIlogin();
    browser.assertUniLoginUser();
  });
});
