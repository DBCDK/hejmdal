/**
 * @file
 * Unittests of functions in ../oauth2.utils.
 */

import {validateRedirectUri} from '../oauth2.utils';

describe('validateRedirectUri unit test', () => {
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

  it('should reject invalid redirect_uri', () => {
    const redirectUri = 'http://hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://hejmdal.test/*']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(false);
  });

  it('should reject invalid redirect_uri with missing path', () => {
    const redirectUri = 'http://hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://*/']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(false);
  });

  it('should reject invalid redirect_uri that has invalid path', () => {
    const redirectUri = 'http://hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://*/invalid']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(false);
  });

  it('should reject invalid redirect_uri that does not match protocol', () => {
    const redirectUri = 'http://hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['https://*/returnurl']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(false);
  });
  it('should reject invalid redirect_uri with - instead of .', () => {
    const redirectUri = 'http://test-hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://test.hejmdal.*/returnurl']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(false);
  });

  it('should accept uri that matches wildcard on host', () => {
    const redirectUri = 'http://hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://*/returnurl']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(true);
  });

  it('should accept uri that matches wildcard on subdomain', () => {
    const redirectUri = 'http://test.hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://*.hejmdal.wrong/returnurl']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(true);
  });

  it('should accept uri that matches wildcard on top level domain', () => {
    const redirectUri = 'http://test.hejmdal.wrong/returnurl';
    const client = {
      redirectUris: ['http://test.hejmdal.*/returnurl']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(true);
  });

  it('should accept uri that matches wildcard on path', () => {
    const redirectUri = 'http://hejmdal.test/returnurl';
    const client = {
      redirectUris: ['http://hejmdal.test/*']
    };
    const result = validateRedirectUri(redirectUri, client);

    expect(result).toEqual(true);
  });
});
