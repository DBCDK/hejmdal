/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 */

import {createHash, validateHash} from '../utils/hash.utils';
import {KeyValueStorage} from '../models/keyvalue.storage.model';

var storage = new KeyValueStorage();

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
  const attributes = {
    cpr: ctx.state.user.cpr
  };
  ctx.state.ticket = {
    attributes: attributes
  };
  return next();
}

/**
 * Write a attribute object to storage, and returns an identifier and token for later retrieval
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function storeTicket(ctx, next) {
  const ticket = ctx.state.ticket;
  if (ticket !== null && ticket.attributes === Object(ticket.attributes) && !ticket.identifier) {
    const identifier = storage.writeObject(ticket.attributes);
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
export function getTicket(ctx, next) {
  let attributes = false;
  if (!ctx.state.ticket && ctx.params.token && ctx.params.id) {
    if (validateHash(ctx.params.token, ctx.params.id)) {
      attributes = storage.readObject(ctx.params.id);
      storage.deleteObject(ctx.params.id);
    }
  }
  ctx.state.ticket = {
    attributes: attributes
  };
  return next();
}
