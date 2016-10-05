/**
 * @file
 *
 * Functions to store and retrieve attributes in a ticket, and invalidate the ticket once it is fetched
 *
 * Tickets are identified by a ticketId and ticketToken
 *
 * ? serviceId is used by storeTicket but not used - part of salting? and part of getTicket
 * ? store return id and token
 * ? export function at top or bottom
 * ? filterings/mapping of CULR data to attributes to store
 * ? DB functions moved otherwise
 */

import crypto from 'crypto';
import {log} from '../utils/logging';

const ticketDB = {};

const secretSalt = '$2a$10$CxBm8c7NDbvi24vGV7pwOe';  //  TODO: should be fetched from some setting

/**
 *
 * @param {string} serviceId
 * @param {object} attributes
 * @return {string}
 */
export function storeTicket(serviceId, attributes) {
  const ticketIdentifier = getNextTicketIdentifier();
  const ticketToken = generateTicketToken(ticketIdentifier);

  writeTicketToDb(ticketIdentifier, attributes);

  return {ticketIdentifier: ticketIdentifier, ticketToken: ticketToken};
}

/**
 *
 * @param {string} ticketIdentifier
 * @param [string} ticketToken
 * @param {boolean} invalidate
 * @return {mixed}
 */
export function getTicket(ticketIdentifier, ticketToken, invalidate = true) {
  let attributes = false;

  if (validateTicket(ticketIdentifier, ticketToken)) {
    attributes = readTicketFromDb(ticketIdentifier);
    if (invalidate) {
      deleteTicketInDb(ticketIdentifier);
    }
  }
  return attributes;
}

/**
 *
 * @param {string} ticketIdentifier
 * @return {boolean}
 */
export function invalidateTicket(ticketIdentifier) {
  return deleteTicketInDb(ticketIdentifier);
}

// TODO: ---- the 3 DB functions could live some other place than here  ------
/**
 *
 * @param {string} ticketIdentifier
 * @param {object} attributes
 * @returns {boolean}
 */
function writeTicketToDb(ticketIdentifier, attributes) {    // eslint-disable-line no-unused-vars
  try {
    // TODO: write attributes in ticket to some storage
    ticketDB[ticketIdentifier] = attributes;
  }
  catch (e) {
    log.error('Write ticket', e.message);
  }
  return true;
}

/**
 *
 * @param {string} ticketIdentifier
 * @returns {mixed}
 */
function readTicketFromDb(ticketIdentifier) {           // eslint-disable-line no-unused-vars
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
function deleteTicketInDb(ticketIdentifier) {           // eslint-disable-line no-unused-vars
  try {
    // TODO: delete ticket in some storage
    delete ticketDB[ticketIdentifier];
  }
  catch (e) {
    log.error('Delete ticket', e.message);
  }
  return true;
}

/**
 *
 * @param {string} toHash
 * @return {string}
 */
function digestHMAC(toHash) {
  return crypto.createHmac('sha256', secretSalt).update(toHash).digest('hex');
}

/**
 * Verify that ticketToken is generated from ticketIdentifier
 *
 * @param {string} ticketIdentifier
 * @param {string} ticketToken
 * @return {boolean}
 */
function validateTicket(ticketIdentifier, ticketToken) {
  return (ticketToken === digestHMAC(ticketIdentifier));
}

/**
 * generate a ticketToken from ticketIdentifier
 *
 * @param {string} ticketIdentifier
 * @return {string}
 */
function generateTicketToken(ticketIdentifier) {

  return digestHMAC(ticketIdentifier);
}

/**
 *
 * @return {string}
 */
function getNextTicketIdentifier() {
  // TODO: fetch number from unique counter or create unique sequence
  return '12345';
}

