import {getClientById, getClientByToken} from './smaug.client';
import {log} from '../../utils/logging.util';
import {CONFIG} from '../../utils/config.util';

export async function getClientInfoByClientId(clientId) {
  try {
    const smaugClient = await getClientById(clientId);
    return await extractClientInfo(smaugClient);
  } catch (error) {
    log.info('Invalid client', {error: error.message, stack: error.stack});
    return null;
  }
}

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
export function extractClientInfo(client) {
  if (!client.app.clientId) {
    throw new Error('Invalid Client', client);
  }

  const serviceClient = {
    clientId: client.app.clientId,
    name: client.displayName,
    logoutScreen: client.logoutScreen || 'include',
    identityProviders: client.identityProviders || [],
    attributes: client.attributes || [],
    borchkServiceName: client.borchkServiceName || null,
    urls: client.urls || {},
    grants: client.grants,
    redirectUris: client.redirectUris,
    clientSecret: client.app.clientSecret
  };

  if (CONFIG.app.env === 'test') {
    serviceClient.urls.host = CONFIG.app.host;
  }

  return serviceClient;
}
