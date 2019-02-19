/**
 * @file
 *
 * Functions to retrieve attributes in a ticket.
 */

import PersistentUserStorage from '../../models/User/user.persistent.storage.model';
import {getUserAttributesFromCulr} from '../Culr/culr.component';
import {mapCulrResponse} from '../../utils/attribute.mapper.util';
import {getClientById} from '../Smaug/smaug.client';
import {log} from '../../utils/logging.util';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import MemoryStorage from '../../models/memory.storage.model';
import {CONFIG} from '../../utils/config.util';
import {createHash} from '../../utils/hash.utils';

const storage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentUserStorage());

/**
 * Fetch an attribute object from storage from the identifier and token.
 *
 * @param req
 * @param res
 * @param next
 */
export async function getUser(req, res, next) {
  const {user, client: clientId} = res.locals.oauth.token;
  try {
    const ticketAttributes = await getUserAttributesForClient(user, clientId);
    res.json({attributes: ticketAttributes});
  } catch (error) {
    log.error('Could not generate user info', {error});
    next();
  }
}

export async function getUserAttributesForClient (user, clientId) {
    const [culrAttributes, client] = await Promise.all([
      getUserAttributesFromCulr(user.userId, user.agency),
      getClientById(clientId)
    ]);
    return mapCulrResponse(
      culrAttributes,
      client.attributes,
      user,
      clientId
    );
}

/**
 * Get user from storage.
 *
 * @param {String} token
 */
export async function readUser(token) {
  const hashedToken = createHash(token);
  return await storage.read(hashedToken);
}

/**
 * Save user to storage.
 *
 * @param token
 * @param {Object} user
 */
export async function saveUser(token, user) {
  const hashedToken = createHash(token);
  return await storage.update(hashedToken, user);
}

/**
 * Delete user from storage.
 *
 * @param {String} token
 */
export async function deleteuser(token) {
  const hashedToken = createHash(token);
  return await storage.delete(hashedToken);
}
