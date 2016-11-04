/* eslint-disable */
import {assert} from 'chai';

describe('Testing the Example appliction', () => {
  it('Go with the flow', () => {
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl = browser.getUrl();

    assert.isTrue(examplePageUrl.includes('/example/'));
  });
});
