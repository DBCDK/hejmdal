import {ATTRIBUTES} from '../../../utils/attributes.util';
import {CONFIG} from '../../../utils/config.util';

export const mockData = {
  identityProviders: ['nemlogin', 'borchk', 'unilogin', 'wayf'],
  borchkServiceName: 'bibliotek.dk',
  attributes: ATTRIBUTES,
  app: {
    orderpolicyrequester: '190101',
    clientId: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f',
    clientName: 'Test Service'
  },
  urls: {
    host: `http://localhost:${CONFIG.app.port}`,
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
  if (token === CONFIG.test.token) {
    return {
      statusCode: 200,
      body: JSON.stringify(mockData)
    };
  }

  return {
    statusCode: 404
  };
}

