import {ATTRIBUTES} from '../../../utils/attributes.util';
import {CONFIG} from '../../../utils/config.util';

export const mockData = {
  grants: ['authorization_code', 'password'],
  identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
  redirectUris: [
    `${process.env.HOST}/callback`,
    `${process.env.HOST}/example`,
    `${process.env.HOST}/example/provider/callback`
  ],
  displayName: 'Test Service',
  borchkServiceName: 'bibliotek.dk',
  attributes: ATTRIBUTES,
  logoutScreen: 'include',
  requireConsent: false,
  app: {
    orderpolicyrequester: '190101',
    clientId: 'hejmdal',
    clientSecret: 'hejmdal_secret',
    clientName: 'Test Service'
  },
  urls: {
    host: `http://localhost:${CONFIG.app.port}`,
    returnUrl: '/example/'
  }
};

export const hejmdalMockData = {
  displayName: 'Hejmdal Test Service',
  identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
  borchkServiceName: 'bibliotek.dk',
  attributes: {},
  logoutScreen: 'include',
  app: {
    orderpolicyrequester: '190101',
    clientId: CONFIG.smaug.hejmdalClientId,
    clientName: 'Hejmdal Test Service'
  },
  urls: {
    host: `http://localhost:${CONFIG.app.port}`,
    returnUrl: '/profile'
  }
};

/**
 * Mock Client for test and development
 *
 * @param clientId
 * @returns {*}
 */
export default function getMockClient(clientId) {
  if (clientId === 'hejmdal' || clientId === CONFIG.test.token) {
    return mockData;
  }

  if (clientId === 'd83a6fba8a7847d1add4703cc237cb72') {
    return Object.assign({}, mockData, {
      identityProviders: ['unilogin'],
      attributes: {uniloginId: ATTRIBUTES.uniloginId}
    });
  }

  if (clientId === 'hejmdal-access-token') {
    return hejmdalMockData;
  }

  return null;
}

/**
 * Mock Client for test and development
 *
 * @param token
 * @returns {*}
 */
export function getMockValidateUserTokenClient(
  clientId,
  agency,
  username,
  password
) {
  if (username === 'wrong_user') {
    return {
      statusCode: 403
    };
  }
  if (agency === '724000' && username === '87654321' && password === '1234') {
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: 'qwerty123456asdfgh'})
    };
  }
  if (clientId === mockData.app.clientId) {
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: CONFIG.test.token})
    };
  }
  if (agency === null && username === '@' && password === '@') {
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: 'hejmdal-access-token'})
    };
  }
  return {
    statusCode: 403
  };
}
