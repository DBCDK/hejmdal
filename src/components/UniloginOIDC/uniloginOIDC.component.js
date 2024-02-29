/**
 * @file
 * Provides UNI-Login integration
 */

import {log} from '../../utils/logging.util';
import crypto from 'crypto';
import base64url from 'base64url';

import {CONFIG} from '../../utils/config.util';
import {getOidcTokens, getReturnUrl, getUserInfo} from './uniloginOIDC.client';
import {getMockedUniloginOidcLogoutUrl, getMockedUniloginOidcUrl} from './mocks/uniloginOIDC.mock';
import {identityProviderValidationFailed} from '../Identityprovider/identityprovider.component';

/* remove debugging when oidc is in production */
const consoleDebug = true;

/**
 * Genereates and returns a url to be used for login using OIDC UNI-Login
 *
 * @param {string} token
 * @param {object} identity
 * @param {object} oidcCodes
 * @returns {string}
 */
export function getUniloginOidcUrl(token, identity, oidcCodes) {
  return CONFIG.mock_externals.uniloginOidc
    ? getMockedUniloginOidcUrl(token)
    : getLiveUniloginOidcUrl(token, identity, oidcCodes);
}

/**
 *
 * @param token
 * @returns {*}
 */
export function getUniloginOidcLogoutUrl(token) {
  return CONFIG.mock_externals.uniloginOidc
      ? getMockedUniloginOidcLogoutUrl(token)
      : getLiveUniloginOidcLogoutUrl(token);
  }

  /**
   * Validates the OIDC unilogin ticket and fetch the access token
 * Parameter "sub" (subject Identifier) is "Tjenestespecifikt pseudonym for brugeren som logger ind.
 *                                            Pr. default sættes brugerens BrokerID som sub."
 * All dataelements as specified in https://viden.stil.dk/pages/viewpage.action?pageId=161059336
 *
 * @param req
 * @returns {Promise<string|boolean>}
 */
export async function validateUniloginOidcTicket(req) {
  let userInfo = false;
  const {code} = req.query;
  const {uniloginOidcCodes} = req.getUser();
  const {idpIdentity} = req.getState().serviceClient;
  const token = req.getState().stateHash;
  // if unilogin id and secret are set in the specific smaug-client, use that instead of the general setting
  const uniloginIdentity = {
    id: idpIdentity.unilogin.id ?? CONFIG.unilogin_oidc.id,
    secret: idpIdentity.unilogin.secret ?? CONFIG.unilogin_oidc.secret
  };
  if (consoleDebug) { console.log('validate OIDC identity', uniloginIdentity); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC code', code); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC token', token); }  // eslint-disable-line no-console
  log.debug('OIDC validate code', {code: code});
  require('request').debug = consoleDebug;
  if (code) {
    const {access_token, id_token} = await getOidcTokens(code, token, uniloginIdentity, uniloginOidcCodes);
    log.debug('OIDC validate access_token', {access_token, id_token});
    if (access_token) {
      req.setUser({uniloginOidcIdToken: id_token});  // save id_token for later logout
      userInfo = await getUserInfo(access_token, uniloginIdentity);
      log.debug('OIDC validate userInfo', userInfo);
    }
  }
  require('request').debug = false;
  return userInfo;
}

/**
 * Constructs the URL that should be used to redirect the user to UNI-Login
 *
 * @param {string} token
 * @param {object} identity
 * @param {object} oidcCodes
 * @return {string}
 */
function getLiveUniloginOidcUrl(token, identity, oidcCodes) {
  const returnUrl = getReturnUrl(token);
  const params = [
    'response_type=code',
    'client_id=' + (identity.id ?? CONFIG.unilogin_oidc.id),
    'redirect_uri=' + encodeURIComponent(returnUrl),
    'scope=InstitutionIdsClientScope UserHasLicenseClientScope openid',
    'acr_values=To_Faktor',
    'nonce=' + randomString(20),
    'code_challenge=' + oidcCodes.code_challenge,
    'code_challenge_method=S256'
  ];
  const unilogin = CONFIG.unilogin_oidc.auth_url + '?' + params.join('&');
  if (consoleDebug) { console.log('oidcCodes', oidcCodes); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('identity', identity); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('params', params); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('unilogin', unilogin); }  // eslint-disable-line no-console
  return unilogin;
}

/**
 * Constructs the URL that should be used to redirect the user to logout from UNI-Login
 *
 * @param token
 */
function getLiveUniloginOidcLogoutUrl(token) {
  const returnUrl = CONFIG.app.host.replace('http://localhost:3011', 'https://localhost') + '/logout';
  const params = [
    'post_logout_redirect_uri=' + encodeURIComponent(returnUrl),
    'id_token_hint=' + token
  ];
  const unilogout = CONFIG.unilogin_oidc.logout_url + '?' + params.join('&');
  if (consoleDebug) { console.log('returnUrl', returnUrl); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('params', params); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('unilogout', unilogout); }  // eslint-disable-line no-console
  return unilogout;
}

/** create a random code_verifier and the corresponding code_challenge
 *
 * https://viden.stil.dk/display/OFFSKOLELOGIN/Implementering+af+tjeneste#Implementeringaftjeneste-1.2.1Hvordangenerereskorrektcode_challengeogcodeverifier
 *
 * @returns {{code_verifier: string, code_challenge}}
 */
export function createUniloginOidcCodes() {
  const code_verifier = randomString(128);
  const hash = crypto.createHash('sha256').update(code_verifier).digest();
  const code_challenge = base64url.encode(hash);
  return {code_verifier, code_challenge};
}

/** use crypto to generate a random string
 *
 * @param length
 * @returns {string}
 */
function randomString(length) {
  return crypto.randomBytes((length + 1) / 2).toString('hex').substr(0, length);
}

/** Pick data elements aktoer_gruppe and uniid from the unilogin OIDC ticket
 * Some of the elements is specified in https://viden.stil.dk/pages/viewpage.action?pageId=161059336 and
 *                                      https://viden.stil.dk/display/OFFSKOLELOGIN/Tilslut+OIDC
 *
 * aktoer_gruppe is the user type, test users found with Elev and Medarbejder (and Kontakt)
 * - Fra STIL: Medarbejder og "lærer" mappes begge til "Medarbejder"
 * uniid looks like some internal non crypted user id and unique
 * - Fra STIL: uniid er unikt for brugeren, personen og kan benyttes til unik identifikation.
 *             en bruger i unilogin beholder sit uniid i hele brugerens levetid i vores system.
 *             Hvis en bruger slettes går der stadig minimum 1 år før vi fjerner tilknytningen til uniid, og uniid er helt unikt
 * - Fra STIL: Institutions_ids burde nu blive returneret dog kun for testbrugere der har licens. Dette skyldes at claimet
 *             er et GivAdgang specifikt felt og kun institutioner som brugeren er tilknyttet OG har licens til returneres
 *
 *
 * @param req
 * @returns {Promise<*>}
 */
export async function uniloginOidcCallback(req) {
  console.log('uniloginOidcCallback', req.params);
  const oidcResult = await validateUniloginOidcTicket(req);
  console.log('uniloginOidcCallback result', oidcResult);
  if (oidcResult && oidcResult.uniid) {
    req.setUser({
      userType: 'unilogin_oidc',
      userId: oidcResult.uniid,
      uniid: oidcResult.uniid,
      aktoer_gruppe: oidcResult.aktoer_gruppe ?? null,
      has_license: oidcResult.has_license === 'true',
      institution_ids: oidcResult.institution_ids ?? null
    });
  } else {
    identityProviderValidationFailed(req);
  }

  return req;
}
