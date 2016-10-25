import compose from 'koa-compose';
import {log} from '../../utils/logging.util';
import {createHash, validateHash} from '../../utils/hash.utils';
import {VERSION_PREFIX} from '../../utils/version.util';
import index from './templates/index.template';
import borchk from './templates/borchk.template';
import nemlogin from './templates/nemlogin.template';
import unilogin from './templates/unilogin.template';

const templates = {index, borchk, nemlogin, unilogin};

/**
 * Returns Identityprovider screen if user is not logged in.  TODO: in its own component???
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function authenticate(ctx, next) {
  try {
    if (!ctx.hasUser()) {
      const state = ctx.getState();
      const authToken = createHash(state.smaugToken);
      const identityProviders = state.serviceClient.identityProviders;
      const content = identityProviders.map(value => templates[value](VERSION_PREFIX, authToken)).join('');

      ctx.body = index({title: 'Log ind via ...', content});
      ctx.status = 200;
    }
  }
  catch (e) {
    log.error('Error in autheticate method', {error: e.message, stack: e.stack});
    ctx.status = 404;
  }

  await next();
}

/**
 * Parses the callback parameters for unilogin.
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function uniloginCallback(ctx, next) {
  if (ctx.params.type !== 'unilogin') {
    return next();
  }

  ctx.setUser({
    userId: ctx.query.id,
    userType: 'unilogin',
    identityProviders: ['unilogin']
  });
}

/**
 * Parses the callback parameters for borchk.
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function borchkCallback(ctx, next) {
  if (ctx.params.type !== 'borchk') {
    return next();
  }
  ctx.setUser({
    userId: ctx.query.id,
    userType: 'borchk',
    identityProviders: ['borchk'],
    libraryId: 'libraryId',
    pincode: 'pincode'
  });
}

/**
 * Parses the callback parameters for nemlogin.
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function nemloginCallback(ctx, next) {
  if (ctx.params.type !== 'nemlogin') {
    return next();
  }
  ctx.setUser({
    userId: ctx.query.id,
    userType: 'nemlogin',
    identityProviders: ['nemlogin']
  });
}

/**
 * Callback function from external identityproviders
 *
 * @param ctx
 * @param next
 */
export async function identityProviderCallback(ctx, next) {
  try {
    if (!validateHash(ctx.params.token, ctx.getState().smaugToken)) {
      ctx.status = 403;
      await next();
    }

    compose([borchkCallback, uniloginCallback, nemloginCallback])(ctx, next);
  }
  catch (e) {
    log.error('Error in identotyProviderCallback', {error: e.message, stack: e.stack});
    ctx.status = 500;
  }

  await next();
}
