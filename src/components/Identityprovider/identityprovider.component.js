/**
 * @file
 *
 */
import {log} from '../../utils/logging.util';
import {createHash, validateHash} from '../../utils/hash.utils';
import {VERSION_PREFIX} from '../../utils/version.util';
import index from './templates/index.template';
import borchk from './templates/borchk.template';
import nemlogin from './templates/nemlogin.template';
import {getUniloginURL, validateUniloginTicket} from '../UniLogin/unilogin.component';
import {validateUserInLibrary, getBorchkResponse} from '../Borchk/borchk.component';
import {getWayfResponse} from '../Wayf/wayf.component';
import {CONFIG} from "../../utils/config.util";

const templates = {index, borchk, nemlogin, unilogin: getUniloginURL};

/**
 * Returns Identityprovider screen if user is not logged in.
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
      const content = identityProviders.map(value => templates[value](authToken)).join('');

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
export function uniloginCallback(ctx) {
  // TODO validate unilogin callback
  let userId = null;
  if (CONFIG.mock_externals.unilogin) {
    userId = ctx.query.id;
  }
  else if (validateUniloginTicket(ctx.query)) {
    userId = ctx.query.user;
  }

  console.log('userId: ', userId);

  ctx.setUser({
    userId: userId,
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
  const response = await getWayfResponse(ctx);
  ctx.setUser({
    userId: response.userId,
    userType: 'nemlogin',
    identityProviders: ['nemlogin']
  });
  return ctx;
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
