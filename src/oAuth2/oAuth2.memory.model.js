/* eslint-disable */

import {getClientInfoByClientId} from '../components/Smaug/smaug.component';
import {saveUser} from '../components/User/user.component';

/**
 * Module dependencies.
 */

const mock = {
  tokens: [],
  grants: 'authorization_code',
  users: [],
  authorizationCodes: new Map()
};

module.exports.mock = mock;

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
    user: user.userId
  };
  code = Object.assign({}, code, {
    client: client.clientId,
    user: user.userId
  });

  saveUser(user);

  mock.authorizationCodes.set(code.authorizationCode, codeToSave);
  return code;
};

/*
 * Save authorization code
 */
module.exports.getAuthorizationCode = function(authorizationCode) {
  const code = mock.authorizationCodes.get(authorizationCode);

  if (!code) {
    return null;
  }

  code.client = {clientId: code.client};
  code.user = {id: code.user};

  return code;
};

/*
 * Save authorization code
 */
module.exports.revokeAuthorizationCode = function(params) {
  console.log('saveAuthorizationCode', params);

  return params;
};

/*
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  var tokens = mock.tokens.filter(function(token) {
    return token.accessToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
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
 * Get refresh token.
 */

module.exports.getRefreshToken = function*(bearerToken) {
  console.log('getRefreshToken', bearerToken);
  var tokens = mock.tokens.filter(function(token) {
    return token.refreshToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/*
 * Get user.
 */

module.exports.getUser = function*(username, password) {
  var users = mock.users.filter(function(user) {
    return user.username === username && user.password === password;
  });

  return users.length ? users[0] : false;
};

/**
 * Save token.
 */

module.exports.saveToken = function*(token, client, user) {
  const access_token = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client: client.clientId,
    user: user.id
  };
  mock.tokens.push(access_token);

  return access_token;
};

module.exports.revokeToken = token => {
  mock.tokens = mock.tokens.filter(t => t.accessToken !== token);
};

module.exports.dump = function() {
  console.log('clients', mock.clients);
  console.log('tokens', mock.tokens);
  console.log('users', mock.users);
};
