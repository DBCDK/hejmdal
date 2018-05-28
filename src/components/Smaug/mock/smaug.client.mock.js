import {ATTRIBUTES} from '../../../utils/attributes.util';
import {CONFIG} from '../../../utils/config.util';

export const mockData = {
  displayName: 'Test Service',
  identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
  borchkServiceName: 'bibliotek.dk',
  attributes: ATTRIBUTES,
  logoutScreen: 'include',
  app: {
    orderpolicyrequester: '190101',
    clientId: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
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
 * @param token
 * @returns {*}
 */
export default function getMockClient(token) {
  if (token === CONFIG.test.token) {
    return {
      statusCode: 200,
      body: JSON.stringify(mockData)
    };
  }

  if (token === 'd83a6fba8a7847d1add4703cc237cb72') {
    const mockUni = Object.assign({}, mockData, {identityProviders: ['unilogin'], attributes: {uniloginId: ATTRIBUTES.uniloginId}});
    return {
      statusCode: 200,
      body: JSON.stringify(mockUni)
    };
  }

  if (token === 'hejmdal-access-token') {
    return {
      statusCode: 200,
      body: JSON.stringify(hejmdalMockData)
    };
  }

  return {
    statusCode: 404
  };
}

/**
 * Mock Client for test and development
 *
 * @param token
 * @returns {*}
 */
export function getMockValidateUserTokenClient(clientId, library, username, password) {
  if (library === '724000' && username === '87654321' && password === '1234') {
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
  if (library === null && username === '@' && password === '@') {
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: 'hejmdal-access-token'})
    };
  }
  return {
    statusCode: 403
  };
}
