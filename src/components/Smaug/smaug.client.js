import {CONFIG} from '../../utils/config.util';
import {TokenError} from './smaug.errors';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';
import mockClient, {
  getMockValidateUserTokenClient,
  mockRevokeToken,
  mockGetTokenByAuth
} from './mock/smaug.client.mock';

export async function getTokenByAuth(auth) {
  if (!auth) {
    log.error('Missing required auth');
    return false;
  }

  // if (CONFIG.mock_externals.smaug) {
  //   return mockGetTokenByAuth(auth);
  // }

  try {
    const response = await promiseRequest('post', {
      url: CONFIG.smaug.oauthTokenUri,
      method: 'POST',
      body: 'grant_type=password&username=@&password=@',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth
      }
    });
    const parsed = JSON.parse(response.body);
    return parsed.access_token;
  } catch (e) {
    log.error('Error validating authorization');
  }
}

/**
 * Retreives context based on given token
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function getClientByToken(token) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.smaug) {
    return mockClient(token);
  }
  response = await promiseRequest('get', {
    uri: CONFIG.smaug.configUri + '/configuration',
    qs: {token: token}
  });

  if (response.statusCode === 200) {
    const obj = JSON.parse(response.body);
    return obj;
  }

  throw new TokenError(response.statusMessage);
}

/**
 * Retreives context based on given clientId
 *
 * @param {String} clientId
 * @return {Object}
 */
export async function getClientById(clientId) {
  if (CONFIG.mock_externals.smaug) {
    return mockClient(clientId);
  }
  const token = await getToken(clientId, null, '@', '@');
  return await getClientByToken(token.access_token);
}

/**
 * Get smaug token.
 *
 * @param {String} clientId
 * @param {String} agency
 * @param {String} username
 * @param {String} password
 * @throws {Error|TokenError}
 */
export async function getToken(clientId, agency, username, password) {
  let response;
  // for test and development
  if (CONFIG.mock_externals.smaug) {
    response = getMockValidateUserTokenClient(
      clientId,
      agency,
      username,
      password
    );
  } else {
    response = await promiseRequest('post', {
      uri: CONFIG.smaug.adminUri + '/clients/token/' + clientId,
      auth: {
        user: CONFIG.smaug.adminUsername,
        pass: CONFIG.smaug.adminPassword
      },
      form: {
        grant_type: 'password',
        username: agency ? `${username}@${agency}` : username,
        password: `${password}`
      }
    });
  }
  if (response.statusCode === 200) {
    const obj = JSON.parse(response.body);
    return obj;
  }

  throw new TokenError(response.statusMessage);
}

/**
 * Revoke client token
 *
 * @param {String} token
 * @return {Object}
 * @throws {Error|TokenError}
 */
export async function revokeToken(token) {
  let response = {};

  // for test and development
  if (CONFIG.app.env === 'test') {
    return mockRevokeToken(token);
  }

  response = await promiseRequest('delete', {
    uri: CONFIG.smaug.uri + '/oauth/token/' + token
  });

  if (response.statusCode === 200) {
    return JSON.parse(response.body);
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
    uri: CONFIG.smaug.configUri + '/health'
  });
}
