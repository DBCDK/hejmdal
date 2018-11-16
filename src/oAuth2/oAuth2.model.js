/* eslint-disable */

import {
  getClientInfoByClientId,
  getTokenForUser,
  extractClientInfo
} from '../components/Smaug/smaug.component';
import {saveUser, readUser} from '../components/User/user.component';
import PersistentAuthCodeStorage from '../models/AuthCode/authcode.persistent.storage.model';
import {CONFIG} from '../utils/config.util';
import KeyValueStorage from '../models/keyvalue.storage.model';
import MemoryStorage from '../models/memory.storage.model';
import {getClientByToken} from '../components/Smaug/smaug.client';
import {log} from '../utils/logging.util';
import {mockData} from '../components/Smaug/mock/smaug.client.mock';

const authStorage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentAuthCodeStorage());

const mockTokens = new Map();

/*
 * Save authorization code
 */
module.exports.saveAuthorizationCode = function(code, client, user) {
  const codeToSave = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: client.clientId,
    user
  };
  code = Object.assign({}, code, {
    client: client.clientId,
    user: user.userId
  });

  authStorage.insert(code.authorizationCode, codeToSave);

  return code;
};

/*
 * Get authorization code
 */
module.exports.getAuthorizationCode = async authorizationCode => {
  const code = await authStorage.read(authorizationCode);

  if (!code) {
    return null;
  }

  code.expiresAt = new Date(code.expiresAt);
  code.client = {clientId: code.client};

  return code;
};

/*
 * Revoke authorization code
 */
module.exports.revokeAuthorizationCode = async params => {
  authStorage.delete(params.authorizationCode);
  return params;
};

/*
 * Get access token.
 */
module.exports.getAccessToken = async bearerToken => {
  if (mockTokens.has(bearerToken)) {
    return mockTokens.get(bearerToken);
  }
  const smaugResponse = await getClientByToken(bearerToken);
  if (!smaugResponse) {
    return false;
  }
  const user = await readUser(bearerToken);
  if (!user) {
    return false;
  }
  return {
    accessToken: bearerToken,
    accessTokenExpiresAt: new Date(smaugResponse.expires),
    user,
    client: smaugResponse.app.clientId
  };
};

/**
 * Get client.
 */
module.exports.getClient = async clientId => {
  if (clientId === 'hejmdal') {
    return extractClientInfo(mockData);
  }
  try {
    return await getClientInfoByClientId(clientId);
  } catch (error) {
    log.error('Error getting smaug client', {error});
    return null;
  }
};

/**
 * Save token.
 */
module.exports.saveToken = async function(token, client, user) {
  if (client.clientId === 'hejmdal') {
    token.client = client.clientId;
    token.user = user.userId;
    mockTokens.set(token.accessToken, token);
    return token;
  }

  try {
    const params = {clientId: client.clientId};
    if (user.pincode && user.libraryId) {
      params.password = user.pincode;
      params.username = user.userId;
      params.library = user.libraryId;
    }
    const smaugToken = user.smaugToken || (await getTokenForUser(params));
    const access_token = {
      accessToken: smaugToken.access_token,
      accessTokenExpiresAt: new Date(Date.now() + smaugToken.expires_in * 1000),
      client: client.clientId,
      user: user.userId
    };
    saveUser(smaugToken.access_token, user);
    return access_token;
  } catch (error) {
    log.error('Could not save token', {error});
  }
};

module.exports.revokeToken = token => {
  // TODO: revoke token from smaug.
};

/*
 * Get user.
 */
module.exports.getUser = async function(user) {
  try {
    const {username, password, agency: library, client_id: clientId} = user;
    const params = {username, password, library, clientId};
    const smaugToken = await getTokenForUser(params);
    user.smaugToken = smaugToken;
    user.userId = username;
    return user;
  } catch (e) {
    return false;
  }
};
