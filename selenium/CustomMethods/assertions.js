/* eslint-disable no-undef */
import {assert} from 'chai';


/* Assertions */
browser.include = (value, selector = 'body') => {
  assert.include(browser.element(selector).getText(), value);
};

browser.notInclude = (value, selector = 'body') => {
  assert.notInclude(browser.element(selector).getText(), value);
};

browser.assertUniLoginUser = () => {
  const session = browser.getSession();
  assert.deepEqual(session.user, {
    userId: '5555666677',
    userType: 'unilogin',
    identityProviders: ['unilogin']
  });
};


