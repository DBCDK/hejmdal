/**
 * @file
 * Provides OIDC UNI-Login integration
 *
 *  https://viden.stil.dk/display/OFFSKOLELOGIN/OIDC
 *
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import {log} from '../../utils/logging.util';
import {uniloginOidcMock} from './mocks/uniloginOIDC.mock';

const consoleDebug = true;

/**
 *
 * @param {string} code
 * @param {string} token
 * @param {object} identity - the unilogin id and secret for the given smaug client
 * @param {object} oidcCodes - code_verifier and code_challenge for the user request
 * @returns {Promise<null>}
 */
export async function getOidcTokens(code, token, identity, oidcCodes) {
  if (CONFIG.mock_externals.uniloginOidc) {
    return uniloginOidcMock(code + token + identity.id + oidcCodes.code_verifier);
  }
  const params = [
    'grant_type=authorization_code',
    'code=' + code,
    'client_id=' + identity.id,
    'redirect_uri=' +  getReturnUrl(token),
    'code_verifier=' +  oidcCodes.code_verifier,
    'client_secret=' +  identity.secret
  ];
  if (consoleDebug) { console.log('getOidcTokens', CONFIG.unilogin_oidc.token_url); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('getOidcTokens', params); }  // eslint-disable-line no-console
  try {
    const response = await promiseRequest('post', {
      url: CONFIG.unilogin_oidc.token_url,
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: params.join('&')
    });
    if (consoleDebug) { console.log('response', response.body); }  // eslint-disable-line no-console
    const parsed = JSON.parse(response.body);
    if (consoleDebug) { console.log('parsed', parsed); }  // eslint-disable-line no-console
    return {access_token: (parsed.access_token ?? null), id_token: (parsed.id_token ?? null)};
  } catch (error) {
    log.error('Error validating getOidcTokens', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 *
 * @param {string} accessToken
 * @param {object} identity - the unilogin id and secret for the given smaug client
 * @returns {Promise<any>}
 */
export async function getUserInfo(accessToken, identity) {
  if (CONFIG.mock_externals.uniloginOidc) {
    return uniloginOidcMock(accessToken);
  }
  const params = [
    'token=' + accessToken,
    'client_id=' + identity.id,
    'client_secret=' +  identity.secret
  ];
  if (consoleDebug) { console.log('getUserInfo', CONFIG.unilogin_oidc.userinfo_url); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('getUserInfo', params); }  // eslint-disable-line no-console
  try {
    const response = await promiseRequest('post', {
      url: CONFIG.unilogin_oidc.userinfo_url,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params.join('&')
    });
    if (consoleDebug) { console.log('response', response.body); }  // eslint-disable-line no-console
    const parsed = response.body ? JSON.parse(response.body) : {error: 'no reponse body'};
    if (consoleDebug) { console.log('parsed', parsed); }  // eslint-disable-line no-console
    log.debug('getUserInfo OIDC', parsed);
    return parsed ?? {};
  } catch (error) {
    log.error('Error validating getUserInfo', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 * Constructs the URL that the user will be redirected to upon successful login at UNI-Login.
 * For local testing, need to make the return url acceptable for unilogin
 *
 * @param token
 * @return {string}
 */
export function getReturnUrl(token = '') {
  // const ego_url =  `${CONFIG.app.host}/login/identityProviderCallback/unilogin_oidc/${token}`;
  const ego_url =  `${CONFIG.app.host}/login/identityProviderCallback/unilogin_oidc/unilogin`;
  // const ret_url = ego_url.replace('http://localhost:3011', 'https://localhost');
  const ret_url = ego_url.replace('http://localhost:3011', 'https://login.bib.dk');
  return ret_url;
  // return ret_url.replace('stg.login.bib.dk', 'login.bib.dk');
}
