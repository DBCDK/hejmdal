export let mockData = {
  identityProviders: ['nemlogin', 'borchk', 'unilogin'],
  attributes: ['cpr', 'name', 'libraries', 'patronId', 'muncipality'],
  app: {
    orderpolicyrequester: '190101',
    clientId: 'a40f3dd8-e426-4e49-b7df-f16a64a3b62f'
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

