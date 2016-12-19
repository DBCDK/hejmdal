/* eslint-disable no-undef */
import LoginPage from '../pageObjects/loginPage';

describe('Test Identity Provider', () => {
  const page = new LoginPage();

  afterEach(() => {
    browser.wipeStores();
    browser.deleteCookie();
  });

  it('should login user with UNIlogin', () => {
    page.login('unilogin');
    browser.assertUniLoginUser();
  });

  it('should test Login with two different service clients in same session', () => {
    // Login in with serviceprovider that requests all attributes
    page.login('wayf', 'asdfg');
    page.acceptConsent();
    page.validateTicket({'attributes.wayfId': 'WAYF-DK-some-other-md5-like-string'});

    // Login with unilogin with a serviceprovider that request only unilogin id
    page.loginDirect('d83a6fba8a7847d1add4703cc237cb72');
    page.acceptConsent();
    page.validateTicket({'attributes.uniloginId': 'test1234'}, ['attributes.wayfId']);
  });

});
