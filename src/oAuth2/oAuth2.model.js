/* eslint-disable */

import {
  getClientInfoByClientId,
  getTokenForUser
} from '../components/Smaug/smaug.component';
import {saveUser, readUser} from '../components/User/user.component';
import PersistentAuthCodeStorage from '../models/AuthCode/authcode.persistent.storage.model';
import {CONFIG} from '../utils/config.util';
import KeyValueStorage from '../models/keyvalue.storage.model';
import MemoryStorage from '../models/memory.storage.model';
import {getClientByToken} from '../components/Smaug/smaug.client';
import {log} from '../utils/logging.util';

const authStorage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentAuthCodeStorage());

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
  try {
    return await getClientInfoByClientId(clientId);
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Save token.
 */
module.exports.saveToken = async (token, client, user) => {
  try {
    const smaugToken = await getTokenForUser({clientId: client.clientId});
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
