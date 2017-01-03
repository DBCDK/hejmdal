import {assert} from 'chai';

import buildReturnUrl from '../buildReturnUrl.util';

describe('buildReturnUrl unit test', () => {
  const serviceClient = {
    urls: {
      host: 'http://hejmdal.test',
      returnUrl: 'returnurl'
    }
  };
  const state = {
    returnUrl: 'returnurl',
    serviceClient
  };

  it('should handle missing /', () => {
    const expected = 'http://hejmdal.test/returnurl';
    const actual = buildReturnUrl(state);

    assert.deepEqual(actual, expected);
  });

  it('should handle multible /', () => {
    const expected = 'http://hejmdal.test/returnurl';
    state.returnUrl = '/returnurl';
    state.serviceClient.urls.host = 'http://hejmdal.test/';
    const actual = buildReturnUrl(state);

    assert.deepEqual(actual, expected);
  });

  it('should use default returnUrl', () => {
    const expected = 'http://hejmdal.test/returnurl';
    state.returnUrl = null;
    state.serviceClient.urls.host = 'http://hejmdal.test/';
    const actual = buildReturnUrl(state);

    assert.deepEqual(actual, expected);
  });

  it('should generate querystring', () => {
    const expected = 'http://hejmdal.test/returnurl?token=abcd&id=1234';
    const actual = buildReturnUrl(state, {token: 'abcd', id: 1234});
    assert.deepEqual(actual, expected);
  });

  it('should urlEncode querystring', () => {
    const expected = 'http://hejmdal.test/returnurl?error=consent%20was%20rejected';
    const actual = buildReturnUrl(state, {error: 'consent was rejected'});
    assert.deepEqual(actual, expected);
  });
});
