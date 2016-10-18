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
    const token = ctx.query.token;
    ctx.session.state.client = await getClient(token);
    return next();
  }
  catch (err) {
    log.error('Invalid Token', err);
    ctx.status = 403;
  }
}

