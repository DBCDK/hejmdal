/**
 * @file
 * Provides UNI-Login integration
 */

import {log} from '../../utils/logging.util';
import moment from 'moment';
import crypto from 'crypto';
import base64url from 'base64url';

import {md5} from '../../utils/hash.utils';
import {CONFIG} from '../../utils/config.util';
import {
  getAccessToken,
  getUserInfo,
  getReturnUrl
} from './uniloginOIDC.client';

require('request').debug = false;

const consoleDebug = false;

/**
 * Genereates and returns a url to be used for login using OIDC UNI-Login
 *
 * @param {string} token
 * @param {object} identity
 * @return {string}
 */
export function getUniloginOidcUrl(token, identity, oidcCodes) {
  return CONFIG.mock_externals.uniloginOidc
    ? getMockedUniloginOidcUrl(token)
    : getLiveUniloginOidcUrl(token, identity, oidcCodes);
}

export function getUniloginOidcLogoutUrl(token, identity, oidcCodes) {
  // 2DO
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
  log.debug('OIDC validate code', code);
  require('request').debug = true;
  if (code) {
    const accessToken = await getAccessToken(code, token, uniloginIdentity, uniloginOidcCodes);
    log.debug('OIDC validate accessToken', accessToken);
    if (accessToken) {
      userInfo = await getUserInfo(accessToken, uniloginIdentity);
      log.debug('OIDC validate userInfo', userInfo);
    }
  }
  require('request').debug = false;
  return userInfo;
}

/**
 *
 * @param token
 * @returns {string}
 */
function getMockedUniloginOidcUrl(token) {
  const user = 'valid_user_id';
  const timestamp = moment()
    .utc()
    .format('YYYYMMDDHHmmss');
  const auth = md5(timestamp + CONFIG.unilogin.secret + user);

  return `/login/identityProviderCallback/unilogin_oidc/${token}?auth=${auth}&timestamp=${timestamp}&user=${user}`;
}

/**
 * Constructs the URL that should be used to redirect the user to UNI-Login
 *
 * @param {string} token
 * @param {object} identity
 * @return {string}
 */
function getLiveUniloginOidcUrl(token, identity, oidcCodes) {
  const returnUrl = getReturnUrl(token);
  const params = [
    'response_type=code',
    'client_id=' + (identity.id ?? CONFIG.unilogin_oidc.id),
    'redirect_uri=' + encodeURIComponent(returnUrl),
    'scope=openid',
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
