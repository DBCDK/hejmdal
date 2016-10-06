/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 * ? DB functions moved otherwise
 */

import {createHash, validateHash} from '../utils/hash.utils';
import {KeyValueStorage} from '../models/keyvalue.storage.model';

var storage = new KeyValueStorage();

/**
 * Write a attribute object to storage, and returns an identifier and token for later retrieval
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function storeTicket(ctx, next) {
  const ticket = ctx.state.ticket;
  if (ticket !== null && ticket.attributes === Object(ticket.attributes) && ticket.identifier === null) {
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
  const ticket = ctx.state.ticket;
  if (ticket !== null && ticket.token !== null && ticket.identifier !== null) {
    ticket.attributes = false;
    if (validateHash(ticket.token, ticket.identifier)) {
      ticket.attributes = storage.readObject(ticket.identifier);
      storage.deleteObject(ticket.identifier);
    }
  }
  return next();
}
