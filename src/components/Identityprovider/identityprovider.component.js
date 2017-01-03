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
import {getText, setLoginReplacersFromAgency} from '../../utils/text.util';
import {ERRORS} from '../../utils/errors.util';
import _ from 'lodash';

/**
 * Returns Identityprovider screen if user is not logged in.
 *
 * @param {object} ctx
 * @param {function} next
 * @returns {*}
 */
export async function authenticate(ctx, next) {
  const state = ctx.getState();
  const loginURL = `/${VERSION_PREFIX}/login?token=${state.smaugToken}`;

  try {
    if (!userIsLoggedIn(ctx)) {
      const identityProviders = getIdentityProviders(state);

      if (_.uniq(_.values(identityProviders)).length === 1 && _.head(_.uniq(_.values(identityProviders))) === null) {
        const serviceClient = state.serviceClient;
        log.error('The service has no valid identityproviders configured', {
          serviceClient: {
            id: serviceClient.id,
            name: serviceClient.name,
            identityProviders: serviceClient.identityProviders
          }
        });
        throw new Error('The service has no valid identityproviders configured');
      }

      if (state.serviceClient.identityProviders.length === 1 && state.serviceClient.identityProviders[0] !== 'borchk') {
        ctx.redirect(identityProviders[state.serviceClient.identityProviders[0]].link);
        return;
      }

      let preselctedName = null;
      let preselectedId = null;
      if (ctx.query.presel) {
        const preselectedLibrary = await getAgency(ctx.query.presel);
        preselctedName = `${preselectedLibrary.branchShortName} - ${preselectedLibrary.agencyName}`;
        preselectedId = preselectedLibrary.branchId;
      }

      const branch = state.serviceAgency ? await getAgency(state.serviceAgency) : null;
      const lockedAgencyName = branch ? `${branch.branchShortName} - ${branch.agencyName}` : null;
      const branches = identityProviders.borchk && !lockedAgencyName ? await getListOfAgenciesForFrontend() : null;
      const error = ctx.query.error ? ctx.query.error : null;
      const loginHelpReplacers = setLoginReplacersFromAgency(branch);
      const helpText = getText(state.serviceClient.identityProviders, loginHelpReplacers, 'login_');

      ctx.render('Login', {
        error: error,

        serviceClient: state.serviceClient.name,
        loginURL,
        identityProviders,
        VERSION_PREFIX,
        branches: branches,
        preselctedName: preselctedName,
        preselectedId: preselectedId,
        lockedAgency: state.serviceAgency || null,
        lockedAgencyName: lockedAgencyName,
        help: helpText
      });

      ctx.status = 200;
      ctx.setState({error: null});
    }
  }
  catch (e) {
    const error = 'Der opstod en fejl som skyldes forkert konfiguration af Bibliotekslogin. Kontakt gerne en administrator på dit bibliotek og gør opmærksom på fejlen.';
    const link = {
      href: loginURL,
      value: 'Prøv igen'
    };
    ctx.render('Error', {error, link});
    log.error('Error in autheticate method', {error: e.message, stack: e.stack});
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
    userType: 'unilogin'
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
    ctx.session.rememberMe = response.rememberMe;
    ctx.setUser({
      userId: response.userId,
      cpr: isValidCpr(response.userId) ? response.userId : null,
      userType: 'borchk',
      libraryId: response.libraryId,
      pincode: response.pincode,
      userValidated: true
    });
  }
  else {
    const librayId = response.libraryId || null;
    idenityProviderValidationFailed(ctx, validated, librayId);
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
    cpr: isValidCpr(response.userId) ? response.userId : null,
    userType: 'nemlogin'
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
    userId: response.userId || response.wayfId, // If userId ist not set we have to use wayfId as userId #190
    wayfId: response.wayfId,
    userType: 'wayf'
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
function getIdentityProviders(state) {

  const authToken = createHash(state.smaugToken);
  const identityProviders = state.serviceClient.identityProviders;
  let providers = {
    borchk: null,
    unilogin: null,
    nemlogin: null,
    wayf: null
  };

  if (identityProviders.includes('borchk')) {
    providers.borchk = {
      action: `${VERSION_PREFIX}/login/identityProviderCallback/borchk/${authToken}`,
      abortAction: state.serviceClient.urls.host
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
 * @param {string} libraryId
 */
function idenityProviderValidationFailed(ctx, error, libraryId) {
  const agencyParameter = ctx.getState().serviceAgency ? '&agency=' + ctx.getState().serviceAgency : '';
  const errorParameter = error.error ? `&error=${error.message}` : '';
  const preselctedLibrary = libraryId ? `&presel=${libraryId}` : '';
  const startOver = `${VERSION_PREFIX}/login?token=${ctx.getState().smaugToken}&returnurl=${ctx.getState().returnUrl}${agencyParameter}${errorParameter}${preselctedLibrary}`;
  ctx.redirect(startOver);
}

/**
 * Check if user is logged in with a valid serviceProvider
 *
 * @param ctx
 * @returns {boolean}
 */
function userIsLoggedIn(ctx) {
  const ips = isLoggedInWith(ctx);
  if (ips.length) {
    if (!ips.includes('borck')) {
      const link = getIdentityProviders(ctx.getState())[ips[0]].link;
      ctx.redirect(link);
    }
    return true;
  }
  return false;
}

/**
 * Returns the valid identityproviders a user is logged in with.
 *
 * @param ctx
 * @returns {*}
 */
function isLoggedInWith(ctx) {
  if (!ctx.hasUser()) {
    return [];
  }
  const identityProviders = ctx.getState().serviceClient.identityProviders;
  return ctx.getUser().identityProviders.filter(ip => identityProviders.includes(ip));
}

