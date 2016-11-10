import {ATTRIBUTES} from '../../../utils/attributes.util';
import {CONFIG} from '../../../utils/config.util';

export const mockData = {
  identityProviders: ['nemlogin', 'borchk', 'unilogin'],
  attributes: ATTRIBUTES,
  app: {
    orderpolicyrequester: '190101',
    clientId: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
    borchkServiceName: 'bibliotek.dk'
  },
  urls: {
    host: `http://localhost:${CONFIG.app.port}`,
    // TODO maybe success and error path, should be given in the login request. Would allow services to refactor
    success: '/example/',
    error: '/thumbsdown'
  }
};

/**
 * Mock Client for test and development
 *
 * @param token
 * @returns {*}
 */
export default function getMockClient(token) {
  if (token === 'valid_token') {
    return {
      statusCode: 200,
      body: JSON.stringify(mockData)
    };
  }

  return {
    statusCode: 404
  };
}

