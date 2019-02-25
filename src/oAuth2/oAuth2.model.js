/* eslint-disable */

import {
  getClientInfoByClientId,
  getTokenForUser,
  extractClientInfo,
  revokeClientToken
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
module.exports.saveAuthorizationCode = async (code, client, user) => {
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

  await authStorage.insert(code.authorizationCode, codeToSave);

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

  try {
    const params = {clientId: client.clientId};
    if (user.pincode && user.agency) {
      params.password = user.pincode;
      params.username = user.userId;
      params.agency = user.agency;
    }
    // If the user is already validated the smaugToken property is added to the user object.
    // If not, a new token is fetched.
    const smaugToken = user.smaugToken || (await getTokenForUser(params));
    const access_token = {
      accessToken: smaugToken.access_token,
      accessTokenExpiresAt: new Date(Date.now() + smaugToken.expires_in * 1000),
      client: client.clientId,
      user: user.userId
    };
    await saveUser(smaugToken.access_token, user);
    return access_token;
  } catch (error) {
    log.error('Could not save token', {error});
  }
};

/**
 * Revoke client token
 */
module.exports.revokeToken = async function(token) {
  try {
    return await revokeClientToken(token);
  } catch (error) {
    log.error('Could not revoke token', {error});
  }
};

/*
 * Get user.
 */
module.exports.getUser = async function(user) {
  try {
    const {username, password, agency, client_id: clientId} = user;
    // User and tokens a fetched from auth.dbc.dk.
    // Therefore we are both validating the user and getting an autherized token in the same step.
    // If user is authorized we add the token object to the user, so we can reuse it in the saveToken method
    const params = {username, password, agency, clientId};
    const smaugToken = await getTokenForUser(params);
    user.smaugToken = smaugToken;
    // user object requires an userId property
    user.userId = username;
    return user;
  } catch (e) {
    return false;
  }
};
