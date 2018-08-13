import {getClient, getToken} from './smaug.client';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';

/**
 * Validate token.
 *
 * If a token does not validate an http error (403) is returned.
 *
 * @param ctx
 * @param next
 */
export async function getAttributes(ctx, next) {
  const serviceClient = await getClientInfo(ctx.getState().smaugToken);
  if (!serviceClient) {
    ctx.status = 403;
  }
  else {
    ctx.setState({serviceClient});
    await next();
  }
}

export async function getClientInfo(smaugToken) {
  try {
    const smaugClient = await getClientFromSmaug(smaugToken);
    return await extractClientInfo(smaugClient);
  }
  catch (error) {
    log.info('Invalid Token', {error: error.message, stack: error.stack});
    return null;
  }
}

export async function getClientFromSmaug(smaugToken) {
  return await getClient(smaugToken);
}

export async function getAuthenticatedToken(ctx, next) {
  const {userId, libraryId, pincode} = ctx.getUser();
  const state = ctx.getState();
  const {authenticatedToken} = state.serviceClient.attributes;
  if (authenticatedToken && userId && libraryId && pincode) {
    const accessToken = await getToken(state.serviceClient.id, libraryId, userId, pincode);
    ctx.setState({authenticatedToken: accessToken});
  }
  await next();
}

/**
 * Extract info about serviceClient from Smaug object
 *
 * @param client
 * @returns {{id: String, identityProviders: Array, attributes: Array}}
 */
export function extractClientInfo(client) {
  if (!client.app.clientId) {
    throw new Error('Invalid Client', client);
  }

  const serviceClient = {
    id: client.app.clientId,
    name: client.displayName,
    logoutScreen: client.logoutScreen || 'include',
    identityProviders: client.identityProviders || [],
    attributes: client.attributes || [],
    borchkServiceName: client.borchkServiceName || null,
    urls: client.urls || {}
  };

  if (CONFIG.app.env === 'test') {
    serviceClient.urls.host = CONFIG.app.host;
  }

  return serviceClient;
}
