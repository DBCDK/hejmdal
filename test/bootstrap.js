const assert = require('chai').assert;
/* eslint-disable */

browser.addCommand('contains', function (value) {
  assert.include(browser.element('body').getText(), value);
});


/* eslint-enable */
