/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import Ticket from './db_models/ticket.model';
import {log} from '../utils/logging.util';

export default class PersistenTicketStorage {

  constructor() {
    this.sequence = 1;

  }

  read(tid) {
    return Ticket.query().select('ticket').where('tid', tid)
      .then((result) => {
        return result[0] ? result[0].ticket : null;
      })
      .catch((error) => {
        log.error('Failed to get ticket', {error: error.message});
        return null;
      });
  }

  insertNext(ticket) {
    const tid = (this.sequence++).toString();
    Ticket.query().insert({tid: tid, ticket: ticket})
      .catch((error) => {
        log.error('Failed to set ticket', {error: error.message});
      });
    return tid;
  }

  insert(tid, ticket) {
    return Ticket.query().insert({tid: tid, ticket: ticket})
      .catch((error) => {
        log.error('Failed to set ticket', {error: error.message});
      });
  }

  delete(tid) {
    // if (1 == 1) { return true; }   // test - do not delete
    return Ticket.query().delete().where('tid', tid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete ticket', {error: error.message});
        return false;
      });
  }
}
