import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import mockClient, {getMockValidateUserTokenClient} from './mock/smaug.client.mock';
import {promiseRequest} from '../../utils/request.util';
/**
 * Retreives context based on given token
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function getClient(token) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.smaug) {
    response = mockClient(token);
  }
  else {
    response = await promiseRequest('get', {
      uri: CONFIG.smaug.uri + '/configuration',
      qs: {token: token}
    });
  }

  if (response.statusCode === 200) {
    const obj = JSON.parse(response.body);
    return obj;
  }

  throw new TokenError(response.statusMessage);
}

/**
 * Retreives context based on given clientId
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function getClientById(clientId) {
  const token = await getToken(clientId, null, '@', '@');
  return (await getClient(token));
}

export async function getToken(clientId, library, username, password) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.smaug) {
    response = getMockValidateUserTokenClient(library, username, password);
  }
  else {
    response = await promiseRequest('post', {
      uri: CONFIG.smaug.adminUri + '/clients/token/' + clientId,
      auth: {
        user: CONFIG.smaug.adminUsername,
        pass: CONFIG.smaug.adminPassword
      },
      form: {
        grant_type: 'password',
        username: library ? `${username}@DK-${library}` : username,
        password: `${password}`
      }
    });
  }
  if (response.statusCode === 200) {
    const obj = JSON.parse(response.body);
    return obj.access_token;
  }

  throw new TokenError(response.statusMessage);
}


/**
 * Check if Smaug webservice is up.
 *
 * @returns {Promise}
 */
export async function health() {
  return await promiseRequest('get', {
    uri: CONFIG.smaug.uri + '/health'
  });
}
