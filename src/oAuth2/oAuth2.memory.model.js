
/**
 * Module dependencies.
 */

const mock =  {
  clients: [{ clientId : 'foo', grants: 'authorization_code', clientSecret : 'nightworld', redirectUris : ['http://dbc.dk'] }],
  tokens: [],
  grants: 'authorization_code',
  users: [{ id : '123', username: 'foobar', password: 'nightworld' }]
};

/*
 * Save authorization code
 */

module.exports.saveAuthorizationCode = function(par) {
  console.log('saveAuthorizationCode', par);

  return true;
};

/*
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  console.log('getAccessToken', bearerToken);
  var tokens = mock.tokens.filter(function(token) {
    return token.accessToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */

module.exports.getClient = function *(clientId, clientSecret) {
  clientSecret = clientSecret ? clientSecret : 'nightworld';
  console.log('getClient', clientId, clientSecret);
  var clients = mock.clients.filter(function(client) {
    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  console.log('clients', clients);
  console.log('return', clients.length ? clients[0] : false);
  return clients.length ? clients[0] : false;
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function *(bearerToken) {
  console.log('getRefreshToken', bearerToken);
  var tokens = mock.tokens.filter(function(token) {
    return token.refreshToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/*
 * Get user.
 */

module.exports.getUser = function *(username, password) {
  console.log('getUser', username, password);
  var users = mock.users.filter(function(user) {
    return user.username === username && user.password === password;
  });

  return users.length ? users[0] : false;
};

/**
 * Save token.
 */

module.exports.saveToken = function *(token, client, user) {
  console.log('saveToken', token, client, user);
  mock.tokens.push({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id
  });
};

/**
 * Save Access token.
 */

module.exports.saveAccessToken = function *(token, client, user) {
  console.log('saveAccessToken', token, client, user);
  mock.tokens.push({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id
  });
};

module.exports.dump = function () {
  console.log('clients', mock.clients);
  console.log('tokens', mock.tokens);
  console.log('users', mock.users);
};
