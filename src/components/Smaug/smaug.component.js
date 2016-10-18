import {getClient} from './smaug.mock';
import {log} from '../../utils/logging.util';

/**
 * Validate token.
 *
 * If a token does not validate. Redirect user to the provided returnUrl
 * @todo Should the application throw a 403 instead of calling the returnURL?
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

    // @todo how to validate returnUrl when token is invalid?
    // @todo add error params to returnUrl
    if (ctx.query.returnUrl) {
      ctx.redirect(ctx.query.returnUrl);
    }
    else {
      ctx.status = 403;
    }
  }
}
