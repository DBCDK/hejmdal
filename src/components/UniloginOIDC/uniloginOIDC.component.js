/**
 * @file
 * Provides UNI-Login integration
 */

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
 * @return {string}
 */
export function getUniloginOidcURL(token) {
  return CONFIG.mock_externals.uniloginOidc
    ? getMockedUniloginOidcUrl(token)
    : getLiveUniloginOidcUrl(token);
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
  const {state, session_state, code} = req.query;
  const token = req.getState().stateHash;
  if (consoleDebug) { console.log('validate OIDC state', state); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC session_state', session_state); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC code', code); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC token', token); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('validate OIDC getState', req.getState()); }  // eslint-disable-line no-console
  if (state && code) {
    const accessToken = await getAccessToken(state, code, token);
    if (consoleDebug) { console.log('accessToken', accessToken); }  // eslint-disable-line no-console
    if (accessToken) {
      userInfo = await getUserInfo(accessToken);
    }
  }
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
 * @param token
 * @return {string}
 */
function getLiveUniloginOidcUrl(token) {
  const {code_verifier, code_challenge} = createUniloginOidcCodes();
  const returnUrl = getReturnUrl(token);
  const params = [
    'response_type=code',
    'state=' + code_verifier,
    'client_id=' + CONFIG.unilogin_oidc.id,
    'redirect_uri=' + encodeURIComponent(returnUrl),
    'scope=openid',
    'acr_values=To_Faktor',
    'nonce=' + randomString(20),
    'code_challenge=' + code_challenge,
    'code_challenge_method=S256'
  ];
  const unilogin = CONFIG.unilogin_oidc.auth_url + '?' + params.join('&');
  if (consoleDebug) { console.log('code_verifier', code_verifier); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('code_challenge', code_challenge); }  // eslint-disable-line no-console
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
function createUniloginOidcCodes() {
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
