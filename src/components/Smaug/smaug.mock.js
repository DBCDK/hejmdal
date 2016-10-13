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
  // Sleep to make it async
  await sleep(100);

  if (clients.has(token)) {
    return clients.get(token);
  }

  throw new TokenError();
}


/**
 * Sleep for x ms.
 *
 * A small util to simulate async behaviour
 *
 * @param ms
 * @returns {Promise}
 */
function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms));
}
