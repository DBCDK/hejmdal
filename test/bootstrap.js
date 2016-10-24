const assert =  require('chai').assert;

browser.addCommand("contains", function (value) {
  assert.include(browser.element('body').getText(), value);
});