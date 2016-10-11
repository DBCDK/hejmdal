/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 */

import {createHash, validateHash} from '../utils/hash.utils';
import KeyValueStorage from '../models/keyvalue.storage.model';
import PersistenTicketStorage from '../models/ticket.persistent.storage.model';
import MemoryStorage from '../models/memory.storage.model';

const memory = true;
const storage = memory ? new KeyValueStorage(new MemoryStorage()) : new KeyValueStorage(new PersistenTicketStorage());

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
  if (ctx.state.user) {
    const attributes = {
      cpr: ctx.state.user.cpr
    };
    ctx.state.ticket = {
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
  const ticket = ctx.state.ticket;
  if (ticket !== null && ticket.attributes === Object(ticket.attributes) && !ticket.identifier) {
    const identifier = await storage.insertNext(ticket.attributes);
    const token = createHash(identifier);

    ctx.state.ticket = Object.assign(ticket, {
      identifier: identifier,
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
  if (!ctx.state.ticket && ctx.params.token && ctx.params.id) {
    if (validateHash(ctx.params.token, ctx.params.id)) {
      attributes = await storage.read(ctx.params.id);
      await storage.delete(ctx.params.id);
    }
  }
  ctx.state.ticket = {
    attributes: attributes
  };
  return next();
}
