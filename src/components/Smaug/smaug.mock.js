import {TokenError} from './smaug.errors';

const clients = new Map();
clients.set('qwerty', {
  id: 'abcde-12345',
  name: 'testService',
  config: {
    identityProviders: ['unilogin', 'borchk'],
    attributes: ['cpr', 'libraries', 'patronId'],
    host: 'example.com'
  }
});

/**
 * Retreives context based on given token
 *
 * @param token
 * @returns {Object}
 * @throws {TokenError}
 */
export async function getClient(token) {
  if (clients.has(token)) {
    return Object.assign({token}, clients.get(token));
  }

  throw new TokenError();
}
