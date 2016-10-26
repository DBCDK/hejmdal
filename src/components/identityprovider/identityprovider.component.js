/**
 * @file
 *
 */
import {form} from 'co-body';
import {log} from '../../utils/logging.util';
import {createHash, validateHash} from '../../utils/hash.utils';
import {VERSION_PREFIX} from '../../utils/version.util';
import index from './templates/index.template';
import borchk from './templates/borchk.template';
import nemlogin from './templates/nemlogin.template';
import unilogin from './templates/unilogin.template';
import {validateUserInLibrary} from '../borchk/borchk.component';

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
 * @returns {*}
 */
export async function uniloginCallback(ctx) {
  ctx.setUser({
    userId: ctx.query.id,
    userType: 'unilogin',
    identityProviders: ['unilogin']
  });
  return ctx;
}

/**
 * Parses the callback parameters for borchk. Parameters from form comes as post
 *
 * @param ctx
 * @returns {*}
 */
export async function borchkCallback(ctx) {
  let validated = false;
  const response = await getBorchkResponse(ctx);
  if (response && response.userId && response.libraryId && response.pincode) {
    validated = await validateUserInLibrary(ctx, response);
  }
  if (validated) {
    ctx.setUser({
      userId: response.userId,
      userType: 'borchk',
      identityProviders: ['borchk'],
      libraryId: response.libraryId,
      pincode: response.pincode,
      userValidated: validated
    });
  }
  else {
    const startOver = VERSION_PREFIX + '/login?token=' + ctx.getState().smaugToken + '&returnurl=' + ctx.getState().returnUrl;
    ctx.setState({startOver: startOver});
  }
  return ctx;
}

/**
 * Parses the callback parameters for nemlogin.
 *
 * @param ctx
 * @returns {*}
 */
export async function nemloginCallback(ctx) {
  ctx.setUser({
    userId: ctx.query.id,
    userType: 'nemlogin',
    identityProviders: ['nemlogin']
  });
  return ctx;
}

/**
 * Retrieving borchk response through co-body module
 *
 * @param ctx
 * @return {{}}
 */
async function getBorchkResponse(ctx) {
  let response = null;
  try {
    response = ctx.fakeBorchkPost ? ctx.fakeBorchkPost : await form(ctx);
  }
  catch (e) {
    log.error('Could not retrieve borchk response', {error: e.message, stack: e.stack});
  }

  return response;
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
    }
    else {
      switch (ctx.params.type) {
        case 'borchk':
          await borchkCallback(ctx);
          break;
        case 'nemlogin':
          await nemloginCallback(ctx);
          break;
        case 'unilogin':
          await uniloginCallback(ctx);
          break;
        default:
          break;
      }
      if (ctx.getState().startOver) {                // IdentityProvider failed in user authentication
        ctx.redirect(ctx.getState().startOver);
      }
    }
  }
  catch (e) {
    log.error('Error in identityProviderCallback', {error: e.message, stack: e.stack});
    ctx.status = 500;
  }

  await next();
}
