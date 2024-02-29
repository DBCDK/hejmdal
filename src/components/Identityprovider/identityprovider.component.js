/**
 * @file
 *
 */
import {log} from '../../utils/logging.util';
import {getUniloginUrl, uniloginCallback} from '../UniLogin/unilogin.component';
import {
  createUniloginOidcCodes,
  getUniloginOidcUrl,
  uniloginOidcCallback
} from '../UniloginOIDC/uniloginOIDC.component';
import {getGateWayfLoginUrl, nemloginCallback, wayfCallback} from '../GateWayf/gatewayf.component';
import {getAgency, getListOfAgenciesForFrontend} from '../../utils/vipCore.util';
import {getText, setLoginReplacersFromAgency} from '../../utils/text.util';
import buildReturnUrl from '../../utils/buildReturnUrl.util';
import _ from 'lodash';
import {ERRORS} from '../../utils/errors.util';
import {borchkCallback} from '../Borchk/borchk.component';
import {dbcidpCallback} from '../DBCIDP/dbcidp.component';

/**
 * Returns Identityprovider screen if user is not logged in.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {*}
 */
export async function authenticate(req, res, next) { // eslint-disable-line complexity
  const state = req.getState();

  try {
    if (state.serviceClient.identityProviders.includes('unilogin_oidc') && !state.uniloginOidcCodes) {
      state.uniloginOidcCodes = createUniloginOidcCodes();
      req.setUser({uniloginOidcCodes: state.uniloginOidcCodes});  // need to save code_challenge and code_verifier for later
    }

    const identityProviders = getIdentityProviders(state);

    if (noValidIdentityProvider(identityProviders, state)) {
      throw new Error('The service has no valid identityproviders configured');
    }

    // check for preselected idp
    if (req.session.query.idp && state.serviceClient.identityProviders.includes(req.session.query.idp)) {
      state.serviceClient.identityProviders = [req.session.query.idp];
    }

    // check for passthru to selected idp
    if (state.serviceClient.identityProviders.length === 1 &&
      state.serviceClient.identityProviders[0] !== 'borchk' &&
      state.serviceClient.identityProviders[0] !== 'netpunkt' &&
      state.serviceClient.identityProviders[0] !== 'dbcidp') {
      res.redirect(identityProviders[state.serviceClient.identityProviders[0]].link);
      return;
    }

    // preselected agency, either by user or client
    const stickyAgency = req.cookies ? req.cookies.stickyAgency : null;
    let preselectedName = null;
    let preselectedId = null;
    if (req.query.presel || req.session.query.presel || stickyAgency) {
      const preselectedLibrary = await getAgency(
        req.query.presel || req.session.query.presel || stickyAgency.replace(/[^\d]/g, '')
      );
      preselectedName = preselectedLibrary.agencyName;
      preselectedId = preselectedLibrary.branchId;
    }

    const branch = state.serviceAgency ? await getAgency(state.serviceAgency) : null;
    const lockedAgencyName = branch ? branch.agencyName : null;
    const lockedBranchRegistrationUrl = (branch && branch.registrationFormUrl) || (branch && branch.branchWebsiteUrl);
    const agencyTypeFilter = req.session.query.agencytype || 'folk,forsk';
    const branches = identityProviders.borchk ? await getListOfAgenciesForFrontend() : null;
    adjustBranches(branches, state.serviceClient);
    const error = req.query.error ? req.query.error : null;
    const loginHelpReplacers = setLoginReplacersFromAgency(branch);
    const helpText = getText(
      [...state.serviceClient.identityProviders, 'customerService'],
      loginHelpReplacers,
      'login_'
    );

    // remove idp's which should not be user selectable - bibliotek.dk functionality
    if (state.serviceClient.hideIdentityProviders) {
      Object.keys(identityProviders).forEach(idp => {
        if (state.serviceClient.hideIdentityProviders.includes(idp)) {
          identityProviders[idp] = null;
        }
      });
    }

    const identityProvidersCount = Object.values(identityProviders).filter(
      ip => ip
    ).length;

    const commonParameters = {
      retries: req.query.retries,
      error: error,
      returnUrl: buildReturnUrl(state, {error: 'LoginCancelled'}),
      serviceClient: state.serviceClient.name,
      identityProviders,
      logoColor: state.serviceClient.logoColor,
      btnStyle: 'background-color:' + state.serviceClient.buttonColor + ';color:' + state.serviceClient.buttonTxtColor,
      btnOnmouseover: 'this.style.backgroundColor=\'' + state.serviceClient.buttonHoverColor + '\';this.style.color=\'' + state.serviceClient.buttonTxtHoverColor + '\'',
      btnOnmouseout: 'this.style.backgroundColor=\'' + state.serviceClient.buttonColor + '\';this.style.color=\'' + state.serviceClient.buttonTxtColor + '\'',
      help: helpText,
      newUser: getText(['newUser']),
      cookie: getText(['cookies']),
      loginToProfile: !!req.session.loginToProfil
    };
    if (state.serviceClient.identityProviders.includes('netpunkt') || state.serviceClient.identityProviders.includes('dbcidp')) {
      res.render('Netpunkt', {
        ...commonParameters,
        title: state.serviceClient.title || 'Netpunkt Login',
        idpAction: state.serviceClient.identityProviders.includes('netpunkt') ? identityProviders.netpunkt.action : identityProviders.dbcidp.action,
        defaultUser: state.serviceClient.defaultUser,
        hideFooter: true
      });
    } else {
      res.render('Login', {
        ...commonParameters,
        title: state.serviceClient.title || 'Log ind',
        agencyTypeFilter,
        identityProvidersCount,
        branches: branches,
        preselectedName: preselectedName,
        preselectedId: preselectedId,
        lockedAgency: state.serviceAgency || null,
        lockedAgencyName: lockedAgencyName,
        selectAgency: req.query.selectAgency,
        lockedBranchRegistrationUrl,
        privacyPolicy: getText(['privacyPolicy'])
      });
    }

    res.status(200);
    req.setState({error: null});
  } catch (e) {
    const error =
      'Der opstod en fejl som skyldes forkert konfiguration af Bibliotekslogin. Kontakt gerne en administrator på dit bibliotek og gør opmærksom på fejlen.';
    const link = {
      href: '/login',
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
 * Callback function from external identityproviders
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function identityProviderCallback(req, res) {
  try {
    if (req.getState().stateHash !== req.params.state) {
      console.log('req.params.state', req.params.state);
      console.log('req.getState().stateHash', req.getState().stateHash);
      if (req.params.type === 'unilogin_oidc' && (!req.params.state || req.params.state === 'unilogin')) {
        req.params.state = req.getState().stateHash;
      }
      else {
        log.error('Invalid state', {params: req.params, state: req.getState()});
        res.status(403);
        return res.send('invalid state');
      }
    }
    switch (req.params.type) {
      case 'borchk':
        await borchkCallback(req, res);
        break;
      case 'dbcidp':
        await dbcidpCallback(req, res, 'dbcidp');
        break;
      case 'nemlogin':
        await nemloginCallback(req);
        break;
      case 'netpunkt':
        await dbcidpCallback(req, res, 'netpunkt');
        break;
      case 'unilogin':
        await uniloginCallback(req);
        break;
      case 'unilogin_oidc':
        await uniloginOidcCallback(req);
        break;
      case 'wayf':
        await wayfCallback(req);
        break;
      default:
        break;
    }
  } catch (e) {
    log.error('Error in identityProviderCallback', {
      error: e.message,
      stack: e.stack,
      params: req.params,
      state: req.getState()
    });

    identityProviderValidationFailed(req, res, ERRORS.error_in_request);
  }
  if (res.headersSent) {
    return; // Something went wrong, and redirect is initiated.
  }
  req.session.save(() => {
    if (req.session.hasOwnProperty('query')) {  // eslint-disable-line no-prototype-builtins
      return res.redirect(
        `/oauth/authorize/?${Object.entries(req.session.query)
          .map(([key, value]) => key + '=' + encodeURIComponent(value))
          .join('&')}`
      );
    }
    // If not do whatever you fancy
    res.redirect('/');
  });
}

/**
 * @param {object} req
 * @param {object} res
 * @param {object} error
 * @param {string} agency
 * @param loginsLeft number
 *
 */
export function identityProviderValidationFailed(req, res, error, agency, loginsLeft) {
  const agencyParameter = req.getState().serviceAgency
    ? '&agency=' + req.getState().serviceAgency
    : '';
  const errorParameter = error.error ? `&error=${error.message}` : '';
  const preselectedLibrary = agency ? `&presel=${agency}` : '';
  const retries = loginsLeft ? `&retries=${loginsLeft}` : '';
  const startOver = `/login?token=${req.getState().smaugToken}&returnurl=${
    req.getState().returnUrl
  }${agencyParameter}${errorParameter}${preselectedLibrary}${retries}`;
  res.redirect(302, startOver);
}

/**
 *
 * @param identityProviders
 * @param state
 * @returns {boolean}
 */
function noValidIdentityProvider(identityProviders, state) {
  let error = false;
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
    error = true;
  }
  return error;
}

/**
 *
 * @param {object} state
 * @return {object}
 */
function getIdentityProviders(state) {
  const {stateHash, uniloginOidcCodes} = state;
  const {identityProviders, idpIdentity} = state.serviceClient;
  let providers = {
    borchk: null,
    dbcidp: null,
    netpunkt: null,
    unilogin: null,
    unilogin_oidc: null,
    nemlogin: null,
    wayf: null
  };

  if (identityProviders.includes('borchk')) {
    providers.borchk = {
      action: `/login/identityProviderCallback/borchk/${stateHash}`,
      abortAction: buildReturnUrl(state, {error: 'LoginCancelled'})
    };
  }

  if (identityProviders.includes('dbcidp')) {
    providers.dbcidp = {
      action: `/login/identityProviderCallback/dbcidp/${stateHash}`,
      abortAction: buildReturnUrl(state, {error: 'LoginCancelled'})
    };
  }

  if (identityProviders.includes('netpunkt')) {
    providers.netpunkt = {
      action: `/login/identityProviderCallback/netpunkt/${stateHash}`,
      abortAction: buildReturnUrl(state, {error: 'LoginCancelled'})
    };
  }

  if (identityProviders.includes('unilogin')) {
    providers.unilogin = {
      link: getUniloginUrl(stateHash)
    };
  }

  if (identityProviders.includes('unilogin_oidc')) {
    providers.unilogin_oidc = {
      link: getUniloginOidcUrl(stateHash, idpIdentity.unilogin ?? {}, uniloginOidcCodes)
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
 * @param req
 * @returns {boolean}
 */
export default function userIsLoggedIn(req) {
  const ips = isLoggedInWith(req);
  if (ips.length) {
    if (!ips.includes('borck')) {
      const link = getIdentityProviders(req.getState())[ips[0]].link;
      req.redirect(link);
    }
    return true;
  }
  return false;
}

/**
 * Returns the valid identityproviders a user is logged in with.
 *
 * @param req
 * @returns {array}
 */
function isLoggedInWith(req) {
  if (!req.hasUser()) {
    return [];
  }
  const identityProviders = req.getState().serviceClient.identityProviders;
  return req
    .getUser()
    .identityProviders.filter(ip => identityProviders.includes(ip));
}

/** Duplicate libraries between library type, so a research library can be found as a municipality library as well
 * the client parameters addAs... contains the list of libraries to be duplicated between library types
 * This is only used very seldom, currently handling 900450 for ereolen to be seen as a municipality library
 *
 * @param branches {Object} List of libraries divided into categories folk, forsk and other
 * @param serviceClient {Array}
 */
function adjustBranches(branches, serviceClient) {
  adjustLibraryType(branches, 'folk', serviceClient.addAsMunicipalityLibrary);
  adjustLibraryType(branches, 'forsk', serviceClient.addAsResearchLibrary);
}

/** Adjust one type of library for the borchk dropdowns.
 * Copies a library to addLibraryType if found in one of the other two categories
 *
 * @param branches {Object}
 * @param addLibraryType {String}
 * @param addLibraries {Array}
 */
function adjustLibraryType(branches, addLibraryType, addLibraries) {
  if (branches === Object(branches) && Array.isArray(addLibraries)) {
    addLibraries.forEach(addLibrary => {
      Object.keys(branches).forEach(category => {
        if (addLibraryType !== category) {
          branches[category].forEach(library => {
            if (library.branchId === addLibrary) {
              branches[addLibraryType].push(library);
            }
          });
        }
      });
    });
  }
}

