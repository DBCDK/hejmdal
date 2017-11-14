import {getClient} from './smaug.client';
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
  try {
    const client = await getClientFromSmaug(ctx.getState().smaugToken);
    ctx.setState({serviceClient: extractClientInfo(client)});
    await next();
  }
  catch (err) {
    log.error('Invalid Token', {error: err.message, stack: err.stack});
    ctx.status = 403;
  }
}

export async function getClientFromSmaug(smaugToken) {
  return await getClient(smaugToken);
}

/**
 * Extract info about serviceClient from Smaug object
 *
 * @param client
 * @returns {{id: String, identityProviders: Array, attributes: Array}}
 */
function extractClientInfo(client) {
  if (!client.app.clientId) {
    throw new Error('Invalid Client', client);
  }

  const serviceClient = {
    id: client.app.clientId,
    name: client.displayName,
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
