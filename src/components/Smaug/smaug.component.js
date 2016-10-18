import {getClient} from './smaug.client';
import {getMockClient} from './smaug.client';
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
    const token = ctx.query.token;
    const client = await getClient(token);
    ctx.session.state.serviceClient = extractClientInfo(client);
    return next();
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
      identityProviders: client.identityProviders || [],
      attributes: client.attributes || []
    };
  }

  throw new Error('Invalid Client', client);
}
