/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 * storeTicket stores ctx.ticket.attributes and return a key and token to the tickket
 * getTicket sets cx.ticket.attributes from the key and token given in ctx.params
 *
 */

import {CONFIG} from '../utils/config.util';
import {createHash, validateHash} from '../utils/hash.utils';
import KeyValueStorage from '../models/keyvalue.storage.model';
import PersistentTicketStorage from '../models/Ticket/ticket.persistent.storage.model';
import MemoryStorage from '../models/memory.storage.model';

const storage = CONFIG.mock_externals.ticket === 'memory' ?
  new KeyValueStorage(new MemoryStorage()) :
  new KeyValueStorage(new PersistentTicketStorage());

/**
 * selects data from CULR / identityProvider as given by the service-context from Smaug
 *
 * TODO: probably in its own component
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function generateTicketData(ctx, next) {
  if (ctx.session.user) {
    const attributes = {
      id: ctx.session.user.id
    };
    ctx.ticket = {
      attributes: attributes
    };
  }
  return next();
}

/**
 * Write a attribute object to storage, and returns an identifier and token for later retrieval
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function storeTicket(ctx, next) {
  const ticket = ctx.ticket;
  if (ticket !== null && ticket.attributes === Object(ticket.attributes) && !ticket.identifier) {
    const id = await storage.insertNext(ticket.attributes);
    const token = createHash(id);

    storage.garbageCollect(CONFIG.garbageCollect.ticket.divisor, CONFIG.garbageCollect.ticket.seconds);
    ctx.ticket = Object.assign(ticket, {
      id: id,
      token: token
    });
  }
  return next();
}

/**
 * Fetch an attribute object from storage from the identifier and token
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function getTicket(ctx, next) {
  let attributes = false;

  if (!ctx.ticket && ctx.params.token && ctx.params.id) {
    if (validateHash(ctx.params.token, ctx.params.id)) {
      attributes = await storage.read(ctx.params.id);
      await storage.delete(ctx.params.id);
    }
  }
  ctx.ticket = {
    attributes: attributes
  };

  return next();
}
