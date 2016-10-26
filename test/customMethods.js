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


