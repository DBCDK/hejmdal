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
import startTiming from '../../utils/timing.util';

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
  try {
    const {user, client: clientId} = res.locals.oauth.token;

    const ticketAttributes = await getUserAttributesForClient(user, clientId);

    log.debug('Userinfo generated', {
      ticketAttributes,
      clientId
    });

    res.json({attributes: ticketAttributes});
  } catch (error) {
    log.error('Could not generate user info', {
      error: error.message,
      stack: error.stack
    });
    next();
  }
}

export async function getUserAttributesForClient(user, clientId) {
  try {
    const [culrAttributes, client] = await Promise.all([
      getUserAttributesFromCulr(user, user.agency),
      getClientById(clientId)
    ]);
    return await mapCulrResponse(
      culrAttributes,
      client.attributes,
      user,
      clientId
    );
  } catch (error) {
    log.error('Could not generate attributes for user', {
      error: error.message,
      stack: error.stack
    });
    return;
  }
}

/**
 * Get user from storage.
 *
 * @param {String} token
 */
export async function readUser(token) {
  const stopTiming = startTiming();
  const hashedToken = createHash(token);
  const result = await storage.read(hashedToken);
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'database',
    function: 'readUser',
    ms: elapsedTimeInMs
  });
  return result;
}

/**
 * Save user to storage.
 *
 * @param token
 * @param {Object} user
 */
export async function saveUser(token, user) {
  const stopTiming = startTiming();
  const hashedToken = createHash(token);
  const result = await storage.update(hashedToken, user);
  const elapsedTimeInMs = stopTiming();
  log.debug('save user', {token, user});
  log.debug('timing', {
    service: 'database',
    function: 'readUser',
    ms: elapsedTimeInMs
  });

  return result;
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
