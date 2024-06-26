import {
  getClientById,
  getClientByToken,
  getToken,
  revokeToken
} from './smaug.client';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';
import {getAgency} from '../../utils/vipCore.util';

/**
 *
 * @param clientId
 * @returns {Promise<*|null>}
 */
export async function getClientInfoByClientId(clientId) {
  try {
    const smaugClient = await getClientById(clientId);
    if (smaugClient) {
      smaugClient.redirectUris = [
        ...(smaugClient.redirectUris || []),
        `${CONFIG.app.host}/example`,
        `${CONFIG.app.host}/cas/callback`
      ];
    }
    return await extractClientInfo(smaugClient);
  } catch (error) {
    log.info('Invalid client', {
      error: error.message,
      stack: error.stack,
      clientId
    });
    return null;
  }
}

/**
 *
 * @param token
 * @returns {Promise<*|null>}
 */
export async function getClientInfoByToken(token) {
  try {
    const smaugClient = await getClientByToken(token);
    return await extractClientInfo(smaugClient);
  } catch (error) {
    log.info('Invalid client', {error: error.message, stack: error.stack});
    return null;
  }
}

/**
 * Extract info about serviceClient from Smaug object
 *
 * @param client
 * @returns {{id: String, identityProviders: Array, attributes: Array}}
 */
/* eslint-disable complexity */
export function extractClientInfo(client) { // eslint-disable-line
  if (!client || !client.app || !client.app.clientId) {
    throw new Error('Invalid Client', client);
  }

  const serviceClient = {
    clientId: client.app.clientId,
    name: client.displayName,
    logoutScreen: client.logoutScreen || 'include',
    identityProviders: client.identityProviders || [],
    hideIdentityProviders: client.hideIdentityProviders || [],
    attributes: client.attributes || [],
    borchkServiceName: client.borchkServiceName || null,
    urls: client.urls || {},
    grants: client.grants,
    redirectUris: client.redirectUris,
    clientSecret: client.app.clientSecret,
    requireConsent: !!client.requireConsent,
    logoColor: client.logoColor ? client.logoColor : '#252525',
    defaultUser: client.display && typeof client.display.defaultUser !== 'undefined' ? client.display.defaultUser : 'netpunkt',
    title: client.display && client.display.title ? client.display.title : '',
    buttonColor: client.display && client.display.buttonColor ? client.display.buttonColor : '#252525',
    buttonHoverColor: client.display && client.display.buttonHoverColor ? client.display.buttonHoverColor : '#e56312',
    buttonTxtColor: client.display && client.display.buttonTxtColor ? client.display.buttonTxtColor : '#ffffff',
    buttonTxtHoverColor: client.display && client.display.buttonTxtHoverColor ? client.display.buttonTxtHoverColor : '#ffffff',
    singleLogoutPath: client.singleLogoutPath,
    proxy: client.proxy || false,
    createCulrAccountAgency: client.createCulrAccountAgency || null,
    addAsMunicipalityLibrary: Array.isArray(client.addAsMunicipalityLibrary) ? client.addAsMunicipalityLibrary : [client.addAsMunicipalityLibrary],
    addAsResearchLibrary: Array.isArray(client.addAsResearchLibrary) ? client.addAsResearchLibrary : [client.addAsResearchLibrary],
    idpIdentity: client.idpIdentity || {},
    user: client.user || {}
  };

  if (CONFIG.app.env === 'test') {
    serviceClient.urls.host = CONFIG.app.host;
  }

  return serviceClient;
}
/* eslint-enable complexity */

/**
 *
 * @param clientId
 * @param agency
 * @param username
 * @param password
 * @returns {Promise<*|undefined>}
 */
export async function getTokenForUser({
  clientId,
  agency = '',
  username = null,
  password = null
}) {
  let loginAgency = agency;
//  Need more consideration. Token must be users agency/branch to get token containing the users agency/branch
//    Using the loginAgency (if any) will fail when retrieving the users rights from dbcidp
/*
  if (loginAgency) {
     const branch = await getAgency(loginAgency);
     loginAgency = branch.loginAgencyId ?? loginAgency;
  }
*/
  return getToken(clientId, loginAgency, username, password);
}

/**
 *
 * @param token
 * @returns {Promise<{count: number}|any|undefined>}
 */
export function revokeClientToken(token) {
  return revokeToken(token);
}
