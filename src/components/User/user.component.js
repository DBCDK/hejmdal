/**
 * @file
 *
 * TODO: rename to user component.
 * Functions to retrieve attributes in a ticket.
 */

import PersistentUserStorage from '../../models/User/user.persistent.storage.model';
import {getUserAttributesFromCulr} from '../Culr/culr.component';
import {mapCulrResponse} from '../../utils/attribute.mapper.util';
import {getClientById} from '../Smaug/smaug.client';
import {log} from '../../utils/logging.util';

const storage = new PersistentUserStorage();

/**
 * Fetch an attribute object from storage from the identifier and token.
 *
 * @param req
 * @param res
 */
export async function getUser(req, res, next) {
  const {user: userId, client: clientId} = res.locals.oauth.token;
  try {
    const [user, culrAttributes, client] = await Promise.all([
      storage.read(userId),
      getUserAttributesFromCulr(userId),
      getClientById(clientId)
    ]);
    const ticketAttributes = mapCulrResponse(
      culrAttributes,
      client.attributes,
      user || {userId},
      clientId
    );
    res.json(ticketAttributes);
  } catch (error) {
    log.error('Could not generate user info', {error});
    next();
  }
}
