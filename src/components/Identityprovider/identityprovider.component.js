/**
 * @file
 *
 */
import {log} from '../../utils/logging.util';
import {isValidCpr} from '../../utils/cpr.util';
import {
  getUniloginURL,
  validateUniloginTicket
} from '../UniLogin/unilogin.component';
import {borchkCallback} from '../Borchk/borchk.component';
import {
  getGateWayfLoginResponse,
  getGateWayfLoginUrl
} from '../GateWayf/gatewayf.component';
import {
  getListOfAgenciesForFrontend,
  getAgency
} from '../../utils/agencies.util';
import {getText, setLoginReplacersFromAgency} from '../../utils/text.util';
import buildReturnUrl from '../../utils/buildReturnUrl.util';
import _ from 'lodash';

/**
 * Returns Identityprovider screen if user is not logged in.
 *
 * @param {object} ctx
 * @param {function} next
 * @returns {*}
 */
export async function authenticate(req, res, next) {
  const state = req.getState();

  // Skal dette bruges til noget. Det virker til at være relateret til profil consent siden.
  const loginURL = '#';
  const loginToProfileURL = `/profile?token=${
    state.smaugToken
  }&loginToProfile=1`;
  const loginToProfile = !!req.session.loginToProfile;

  try {
    const identityProviders = getIdentityProviders(state);

    if (
      _.uniq(_.values(identityProviders)).length === 1 &&
      _.head(_.uniq(_.values(identityProviders))) === null
    ) {
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

    if (
      state.serviceClient.identityProviders.length === 1 &&
      state.serviceClient.identityProviders[0] !== 'borchk'
    ) {
      res.redirect(
        identityProviders[state.serviceClient.identityProviders[0]].link
      );
      return;
    }

    let preselctedName = null;
    let preselectedId = null;
    if (req.query.presel) {
      const preselectedLibrary = await getAgency(req.query.presel);
      preselctedName = preselectedLibrary.agencyName;
      preselectedId = preselectedLibrary.branchId;
    }

    const branch = state.serviceAgency
      ? await getAgency(state.serviceAgency)
      : null;
    const lockedAgencyName = branch ? branch.agencyName : null;
    const agencyTypeFilter = req.query.agencytype || null;
    const branches =
      identityProviders.borchk && !lockedAgencyName
        ? await getListOfAgenciesForFrontend(agencyTypeFilter)
        : null;
    const error = req.query.error ? req.query.error : null;
    const loginHelpReplacers = setLoginReplacersFromAgency(branch);
    const helpText = getText(
      state.serviceClient.identityProviders,
      loginHelpReplacers,
      'login_'
    );

    res.render('Login', {
      error: error,
      returnUrl: buildReturnUrl(state, {error: 'LoginCancelled'}),
      serviceClient: state.serviceClient.name,
      loginURL,
      identityProviders,
      branches: branches,
      preselctedName: preselctedName,
      preselectedId: preselectedId,
      lockedAgency: state.serviceAgency || null,
      lockedAgencyName: lockedAgencyName,
      help: helpText,
      loginToProfile,
      loginToProfileURL
    });

    res.status = 200;
    req.setState({error: null});
  } catch (e) {
    const error =
      'Der opstod en fejl som skyldes forkert konfiguration af Bibliotekslogin. Kontakt gerne en administrator på dit bibliotek og gør opmærksom på fejlen.';
    const link = {
      href: loginURL,
      value: 'Prøv igen'
    };
    res.render('Error', {error, link});
    log.error('Error in autheticate method', {
      error: e.message,
      stack: e.stack
    });
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
  } else {
    idenityProviderValidationFailed(ctx);
  }

  ctx.setUser({
    userId: userId,
    userType: 'unilogin'
  });

  return ctx;
}

/**
 * Parses the callback parameters for nemlogin (via gatewayf).
 *
 * @param ctx
 * @returns {*}
 */
export async function nemloginCallback(ctx) {
  const response = await getGateWayfLoginResponse(ctx, 'nemlogin');

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
  const response = await getGateWayfLoginResponse(ctx, 'wayf');

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
 * @param {Object} req
 * @param {Object} res
 */
export async function identityProviderCallback(req, res) {
  try {
    if (req.params.state !== req.getState().stateHash) {
      res.status = 403;
      return res.send('invalid state');
    }
    let response;
    switch (req.params.type) {
      case 'borchk':
        response = await borchkCallback(
          req.getState().serviceClient.borchkServiceName,
          req.fakeBorchkPost || req.body
        );
        break;
      case 'nemlogin':
        await nemloginCallback(req);
        break;
      case 'unilogin':
        await uniloginCallback(req);
        break;
      case 'wayf':
        await wayfCallback(req);
        break;
      default:
        break;
    }
    if (response.error) {
      return idenityProviderValidationFailed(
        req,
        res,
        response.error,
        response.libraryId
      );
    }
    const {rememberMe, user} = response;
    req.session.rememberMe = rememberMe;
    req.setUser(user);
  } catch (e) {
    log.error('Error in identityProviderCallback', {
      error: e.message,
      stack: e.stack,
      params: req.params,
      state: req.getState()
    });

    res.status = 500;
  }
  req.session.save(() => {
    if (req.session.hasOwnProperty('query')) {
      return res.redirect(
        `/oauth/authorize/?${Object.entries(req.session.query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      );
    }
    // If not do whatever you fancy
    res.redirect('/');
  });
}

/**
 *
 * @param {object} ctx
 * @param {object} error
 * @param {string} libraryId
 */
function idenityProviderValidationFailed(ctx, res, error, libraryId) {
  const agencyParameter = ctx.getState().serviceAgency
    ? '&agency=' + ctx.getState().serviceAgency
    : '';
  const errorParameter = error.error ? `&error=${error.message}` : '';
  const preselctedLibrary = libraryId ? `&presel=${libraryId}` : '';
  const startOver = `/login?token=${ctx.getState().smaugToken}&returnurl=${
    ctx.getState().returnUrl
  }${agencyParameter}${errorParameter}${preselctedLibrary}`;
  res.redirect(302, startOver);
}

/**
 *
 * @param {object} state
 * @return {object}
 */
function getIdentityProviders(state) {
  const {stateHash} = state;
  const identityProviders = state.serviceClient.identityProviders;
  let providers = {
    borchk: null,
    unilogin: null,
    nemlogin: null,
    wayf: null
  };

  if (identityProviders.includes('borchk')) {
    providers.borchk = {
      action: `/login/identityProviderCallback/borchk/${stateHash}`,
      abortAction: buildReturnUrl(state, {error: 'LoginCancelled'})
    };
  }

  if (identityProviders.includes('unilogin')) {
    providers.unilogin = {
      link: getUniloginURL(stateHash)
    };
  }

  if (identityProviders.includes('nemlogin')) {
    providers.nemlogin = {
      link: getGateWayfLoginUrl('nemlogin', stateHash)
    };
  }

  if (identityProviders.includes('wayf')) {
    providers.wayf = {
      link: getGateWayfLoginUrl('wayf', stateHash)
    };
  }

  return providers;
}

/**
 * Check if user is logged in with a valid serviceProvider
 *
 * TODO: Should this be implementet in the authorize endpoint?
 *
 * @param ctx
 * @returns {boolean}
 */
export default function userIsLoggedIn(ctx) {
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
  return ctx
    .getUser()
    .identityProviders.filter(ip => identityProviders.includes(ip));
}
