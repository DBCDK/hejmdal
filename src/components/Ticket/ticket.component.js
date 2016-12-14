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

import {CONFIG} from '../../utils/config.util';
import {createHash, validateHash} from '../../utils/hash.utils';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import PersistentTicketStorage from '../../models/Ticket/ticket.persistent.storage.model';
import MemoryStorage from '../../models/memory.storage.model';

const storage = CONFIG.mock_storage ?
  new KeyValueStorage(new MemoryStorage()) :
  new KeyValueStorage(new PersistentTicketStorage());

/**
 * Write a attribute object to storage, and returns an identifier and token for later retrieval
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function storeTicket(ctx, next) {
  const ticket = ctx.getState().ticket;
  if (ticket !== null && ticket.attributes === Object(ticket.attributes) && !ticket.identifier) {
    ticket.id = await storage.insertNext(ticket.attributes);
    ticket.token = createHash(ticket.id);

    storage.garbageCollect(CONFIG.garbageCollect.ticket.divisor, CONFIG.garbageCollect.ticket.seconds);
    ctx.setState({ticket: ticket});
  }

  await next();
}

/**
 * Fetch an attribute object from storage from the identifier and token
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function getTicket(ctx, next) {
  const ticket = ctx.getState().ticket;
  ticket.attributes = false;

  if (ctx.params.token && ctx.params.id) {
    if (validateHash(ctx.params.token, ctx.params.id)) {
      ticket.attributes = await storage.read(ctx.params.id);
      await storage.delete(ctx.params.id);
    }
  }
  ctx.setState({ticket: ticket});

  ctx.body = JSON.stringify(ticket);

  // Set debug param in url to get the ctx dump
  if (ctx.query.debug === '1') {
    await next();
  }
}
