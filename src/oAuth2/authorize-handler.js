/**
 * @file
 * This file overrides the getClient method on AuthorizeHander in  the dependency oauth2-server/lib/handlers/authorize-handler.
 *
 * This is done to support wildcard return_uri's
 *
 * @see jira ticket [HEJMDAL-587]
 */

import AuthorizeHandler from 'oauth2-server/lib/handlers/authorize-handler';
import {validateAuthRequest, validateRedirectUri} from '../utils/oauth2.utils';

var _ = require('lodash');
var InvalidClientError = require('oauth2-server/lib/errors/invalid-client-error');
var InvalidRequestError = require('oauth2-server/lib/errors/invalid-request-error');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var UnauthorizedClientError = require('oauth2-server/lib/errors/unauthorized-client-error');
var is = require('oauth2-server/lib/validator/is');

AuthorizeHandler.prototype.getClient = function(request) {
  console.log('getTheClient');
  var clientId = request.body.client_id || request.query.client_id;

  if (!clientId) {
    throw new InvalidRequestError('Missing parameter: `client_id`');
  }

  if (!is.vschar(clientId)) {
    throw new InvalidRequestError('Invalid parameter: `client_id`');
  }

  var redirectUri = request.body.redirect_uri || request.query.redirect_uri;

  if (redirectUri && !is.uri(redirectUri)) {
    throw new InvalidRequestError(
      'Invalid request: `redirect_uri` is not a valid URI'
    );
  }
  return promisify(this.model.getClient, 2)
    .call(this.model, clientId, null)
    .then(function(client) {
      if (!client) {
        throw new InvalidClientError(
          'Invalid client: client credentials are invalid'
        );
      }

      if (!client.grants) {
        throw new InvalidClientError('Invalid client: missing client `grants`');
      }

      if (!_.includes(client.grants, 'authorization_code')) {
        throw new UnauthorizedClientError(
          'Unauthorized client: `grant_type` is invalid'
        );
      }

      if (!client.redirectUris || 0 === client.redirectUris.length) {
        throw new InvalidClientError(
          'Invalid client: missing client `redirectUri`'
        );
      }

      if (redirectUri && !validateRedirectUri(redirectUri, client)) {
        throw new InvalidClientError(
          'Invalid client: `redirect_uri` does not match client value'
        );
      }
      return client;
    });
};
