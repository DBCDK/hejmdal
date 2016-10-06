/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 * ? DB functions moved otherwise
 */

import {log} from '../utils/logging';
import {createHash, validateHash} from '../utils/hash.utils';

const ticketDB = {};

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
    const identifier = writeTicketToDb(ticket.attributes);
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
      ticket.attributes = readTicketFromDb(ticket.identifier);
      deleteTicketInDb(ticket.identifier);
    }
  }
  return next();
}

// TODO: ---- the 3 DB functions could live some other place than here  ------
/**
 *
 * @param {string} ticketIdentifier
 * @param {object} attributes
 * @returns {string}
 */
function writeTicketToDb(attributes) {
  let ticketIdentifier;
  try {
    // TODO: write attributes in ticket to some storage
    ticketIdentifier = Object.keys(ticketDB).length;
    ticketDB[ticketIdentifier] = attributes;
  }
  catch (e) {
    log.error('Write ticket', e.message);
  }
  return ticketIdentifier;
}

/**
 *
 * @param {string} ticketIdentifier
 * @returns {mixed}
 */
function readTicketFromDb(ticketIdentifier) {
  let attributes = false;
  try {
    // TODO: read ticket from some storage
    if (ticketDB[ticketIdentifier]) {
      attributes = ticketDB[ticketIdentifier];
    }
  }
  catch (e) {
    log.error('Fetch ticket', e.message);
  }
  return attributes;
}

/**
 *
 * @param ticketIdentifier
 * @returns {boolean}
 */
function deleteTicketInDb(ticketIdentifier) {
  try {
    // TODO: delete ticket in some storage
    delete ticketDB[ticketIdentifier];
  }
  catch (e) {
    log.error('Delete ticket', e.message);
  }
  return true;
}

