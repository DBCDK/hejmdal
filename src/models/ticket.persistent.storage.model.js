/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import Ticket from './db_models/ticket.model';
import {log} from '../utils/logging.util';

export default class PersistenTicketStorage {

  read(tid) {
    return Ticket.query().select('ticket').where('id', tid)
      .then((result) => {
        return result[0] ? result[0].ticket : null;
      })
      .catch((error) => {
        log.error('Failed to get ticket', {error: error.message});
        return null;
      });
  }

  insertNext(ticket) {
    return Ticket.query().insert({ticket: ticket})
      .then((result) => {
        return result.id ? result.id : null;
      })
      .catch((error) => {
        log.error('Failed to set ticket', {error: error.message});
        return null;
      });
  }

  delete(tid) {
    //if (1 == 1) { return true; }   // test - do not delete
    return Ticket.query().delete().where('id', tid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete ticket', {error: error.message});
        return false;
      });
  }
}
