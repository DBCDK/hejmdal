import {getClient} from './smaug.client';
import {log} from '../../utils/logging.util';

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
    const smaugToken = ctx.getState().smaugToken;
    const client = await getClient(smaugToken);
    ctx.setState({serviceClient: extractClientInfo(client)});
    await next();
  }
  catch (err) {
    log.error('Invalid Token', err);
    ctx.status = 403;
  }
}

/**
 * Extract info about serviceClient from Smaug object
 *
 * @param client
 * @returns {{id: String, identityProviders: Array, attributes: Array}}
 */
function extractClientInfo(client) {
  if (client.app.clientId) {
    return {
      id: client.app.clientId,
      name: client.app.clientName,
      identityProviders: client.identityProviders || [],
      attributes: client.attributes || [],
      borchkServiceName: client.borchkServiceName || null,
      urls: client.urls || {}
    };
  }

  throw new Error('Invalid Client', client);
}
