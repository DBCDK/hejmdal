/**
 * @file
 *
 */
import {log} from '../../utils/logging.util';
import {createHash, validateHash} from '../../utils/hash.utils';
import {isValidCpr} from '../../utils/cpr.util';
import {VERSION_PREFIX} from '../../utils/version.util';
import {getUniloginURL, validateUniloginTicket} from '../UniLogin/unilogin.component';
import {validateUserInLibrary, getBorchkResponse} from '../Borchk/borchk.component';
import {getGateWayfResponse, getGateWayfUrl} from '../GateWayf/gatewayf.component';
import {getListOfAgenciesForFrontend, getAgency} from '../../utils/agencies.util';
import {getHelpText, setLoginReplacersFromAgency} from '../../utils/help.text.util';
import {ERRORS} from '../../utils/errors.util';

/**
 * Returns Identityprovider screen if user is not logged in.
 *
 * @param {object} ctx
 * @param {function} next
 * @returns {*}
 */
export async function authenticate(ctx, next) {
  try {
    if (!ctx.hasUser()) {
      const state = ctx.getState();
      const authToken = createHash(state.smaugToken);
      const identityProviders = getIdentityProviders(state.serviceClient.identityProviders, authToken);
      const agency = await getAgency(state.serviceAgency);
      const selectAgencyName = agency.name;
      const branches = identityProviders.borchk && !selectAgencyName ? await getListOfAgenciesForFrontend() : null;
      const error = ctx.query.error ? ctx.query.error : null;
      const loginHelpReplacers = setLoginReplacersFromAgency(agency);
      const helpText = getHelpText(state.serviceClient.identityProviders, loginHelpReplacers, 'login_');

      ctx.render('Login', {
        error: error,
        serviceClient: state.serviceClient.name,
        identityProviders,
        VERSION_PREFIX,
        branches: branches,
        selectedAgency: state.serviceAgency || '',
        selectedAgencyName: selectAgencyName,
        help: helpText
      });

      ctx.status = 200;
      ctx.setState({error: null});
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
  let userId = null;
  if (validateUniloginTicket(ctx.query)) {
    userId = ctx.query.user;
  }
  else {
    idenityProviderValidationFailed(ctx);
  }

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
  let validated = {error: true, message: 'unknown_eror'};
  const response = await getBorchkResponse(ctx);

  if (response && response.userId && response.libraryId && response.pincode) {
    validated = await validateUserInLibrary(ctx, response);
  }
  else {
    validated.message = ERRORS.missing_fields;
  }

  if (!validated.error) {
    ctx.setUser({
      userId: response.userId,
      cpr: isValidCpr(response.userId) ? response.userId : null,
      userType: 'borchk',
      identityProviders: ['borchk'],
      libraryId: response.libraryId,
      pincode: response.pincode,
      userValidated: true
    });
  }
  else {
    idenityProviderValidationFailed(ctx, validated);
  }

  return ctx;
}

/**
 * Parses the callback parameters for nemlogin (via gatewayf).
 *
 * @param ctx
 * @returns {*}
 */
export async function nemloginCallback(ctx) {
  const response = await getGateWayfResponse(ctx, 'nemlogin');

  ctx.setUser({
    userId: response.userId,
    userType: 'nemlogin',
    identityProviders: ['nemlogin']
  });

  return ctx;
}

/**
 * Parses the call parameters for wayf (via gatewayf)
 * @param ctx
 * @returns {*}
 */
export async function wayfCallback(ctx) {
  const response = await getGateWayfResponse(ctx, 'wayf');

  ctx.setUser({
    userId: response.userId,
    userType: 'wayf',
    identityProviders: ['wayf']
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
        case 'wayf':
          await wayfCallback(ctx);
          break;
        default:
          break;
      }
    }
  }
  catch (e) {
    log.error('Error in identityProviderCallback', {
      error: e.message,
      stack: e.stack,
      params: ctx.params,
      state: ctx.getState()
    });

    ctx.status = 500;
  }

  await next();
}

/**
 *
 * @param {Array} identityProviders
 * @param {string} authToken
 * @return {{borchk: null}}
 */
function getIdentityProviders(identityProviders, authToken) {
  let providers = {
    borchk: null,
    unilogin: null,
    nemlogin: null,
    wayf: null
  };

  if (identityProviders.includes('borchk')) {
    providers.borchk = {
      action: `${VERSION_PREFIX}/login/identityProviderCallback/borchk/${authToken}`
    };
  }

  if (identityProviders.includes('unilogin')) {
    providers.unilogin = {
      link: getUniloginURL(authToken)
    };
  }

  if (identityProviders.includes('nemlogin')) {
    providers.nemlogin = {
      link: getGateWayfUrl('nemlogin', authToken)
    };
  }

  if (identityProviders.includes('wayf')) {
    providers.wayf = {
      link: getGateWayfUrl('wayf', authToken)
    };
  }

  return providers;
}

/**
 *
 * @param {object} ctx
 * @param {object} error
 */
function idenityProviderValidationFailed(ctx, error) {
  const agencyParameter = ctx.getState().serviceAgency ? '&agency=' + ctx.getState().serviceAgency : '';
  const errorParameter = error.error ? `&error=${error.message}` : '';
  const startOver = `${VERSION_PREFIX}/login?token=${ctx.getState().smaugToken}&returnurl=${ctx.getState().returnUrl}${agencyParameter}${errorParameter}`;
  ctx.redirect(startOver);
}

