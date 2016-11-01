const assert = require('chai').assert;
/* eslint-disable */


/* Assertions */
browser.include = (value, selector = 'body') => {
  assert.include(browser.element(selector).getText(), value);
};

browser.notInclude = (value, selector = 'body') => {
  assert.notInclude(browser.element(selector).getText(), value);
};

browser.getSession = () => {
  const sessionString = browser.element('#dump-session').getText();
  return JSON.parse(sessionString);
};

browser.getState = () => {
  const sessionString = browser.element('#dump-session').getText();
  return JSON.parse(sessionString).state;
};

browser.assertUniLoginUser = () => {
  const session = browser.getSession();
  assert.deepEqual(session.user, {
    userId: '5555666677',
    userType: 'unilogin',
    identityProviders: ['unilogin']
  });
};


