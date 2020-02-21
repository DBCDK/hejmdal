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
  } catch (error) {
    log.error('Error validating authorization', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 * Retreives client metadata from auth-admin.dbc.dk
 * metadata examples: app-name, owner, email, phone, technical support, etc.
 *
 * @param {String} clientId
 * @return {Object}
 */
export async function getMetadataByClientId(clientId) {
  if (!clientId) {
    log.error('Missing required clientId');
    return false;
  }

  try {
    const response = await promiseRequest('get', {
      uri: `${CONFIG.smaug.adminUri}/clients/${clientId}`,
      auth: {
        user: CONFIG.smaug.adminUsername,
        pass: CONFIG.smaug.adminPassword
      }
    });

    const parsed = JSON.parse(response.body);
    return parsed;
  } catch (error) {
    log.error(
      `Error retrieving client metadata from ${
        CONFIG.smaug.adminUri
      }/clients/${clientId}`,
      {
        stack: error.stack,
        message: error.message
      }
    );
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
  const token = await getToken(clientId, null);
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
export async function getToken(
  clientId,
  agency,
  username,
  password,
  retries = 0
) {
  let response;
  // Set password if both user and password is set
  password = password && username ? password : null;

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
        password
      }
    });
  }
  if (response.statusCode === 200) {
    const obj = JSON.parse(response.body);
    return obj;
  }

  // Temporary fix: Borchk randomly returns service_unavailable. Retry once
  if (retries === 0) {
    log.debug('Token not available - start retry', {
      body: response.body
    });
    return getToken(clientId, agency, username, password, 1);
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
