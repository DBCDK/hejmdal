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
const consoleDebug = false;
/**
 *
 * @param state
 * @param code
 * @param token
 * @returns {Promise<null>}
 */
export async function getAccessToken(state, code, token) {
  if (CONFIG.mock_externals.uniloginOidc) {
    return uniloginOidcMock(state + code + token);
  }
  const params = [
    'grant_type=authorization_code',
    'code=' + code,
    'client_id=' + CONFIG.unilogin_oidc.id,
    'redirect_uri=' +  encodeURIComponent(getReturnUrl(token)),
    'code_verifier=' +  state,
    'client_secret=' +  CONFIG.unilogin_oidc.secret
  ];
  if (consoleDebug) { console.log('getAccessToken', CONFIG.unilogin_oidc.token_url); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('getAccessToken', params); }  // eslint-disable-line no-console
  try {
    const response = await promiseRequest('post', {
      url: CONFIG.unilogin_oidc.token_url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params.join('&')
    });
    if (consoleDebug) { console.log('response', response.body); }  // eslint-disable-line no-console
    const parsed = JSON.parse(response.body);
    if (consoleDebug) { console.log('parsed', parsed); }  // eslint-disable-line no-console
    return parsed.access_token ?? null;
  } catch (error) {
    log.error('Error validating getAccessToken', {
      stack: error.stack,
      message: error.message
    });
  }
}

/**
 *
 * @param accessToken
 * @returns {Promise<any>}
 */
export async function getUserInfo(accessToken) {
  if (CONFIG.mock_externals.uniloginOidc) {
    return uniloginOidcMock(accessToken);
  }
  const params = [
    'token=' + accessToken,
    'client_id=' + CONFIG.unilogin_oidc.id,
    'client_secret=' +  CONFIG.unilogin_oidc.secret
  ];
  if (consoleDebug) { console.log('getUserInfo', CONFIG.unilogin_oidc.userinfo_url); }  // eslint-disable-line no-console
  if (consoleDebug) { console.log('getUserInfo', params); }  // eslint-disable-line no-console
  try {
    const response = await promiseRequest('post', {
      url: CONFIG.unilogin_oidc.userinfo_url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: params.join('&')
    });
    if (consoleDebug) { console.log('response', response.body); }  // eslint-disable-line no-console
    const parsed = response.body ? JSON.parse(response.body) : {error: 'no reponse body'};
    if (consoleDebug) { console.log('parsed', parsed); }  // eslint-disable-line no-console
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
  const ego_url =  `${CONFIG.app.host}/login/identityProviderCallback/unilogin_oidc/${token}`;
  return ego_url.replace('http://localhost:3011', 'https://localhost');
}
