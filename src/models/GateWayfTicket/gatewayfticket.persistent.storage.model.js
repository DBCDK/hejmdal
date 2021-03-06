/**
 * @file
 * Storage model for persistent storage of tickets. CRUD functions
 */

import GateWayfTicket from '../db_models/gatewayfticket.model';
import {log} from '../../utils/logging.util';

export default class PersistentGateWayfTicketStorage {
  readUnencryptedData(tid, secret) {
    return GateWayfTicket.query()
      .select('ticket')
      .where({id: tid, ticketsecret: secret})
      .then(result => {
        return result[0] ? result[0].ticket : null;
      })
      .catch(error => {
        log.error('Failed to get ticket', {error: error.message});
        return null;
      });
  }

  delete(tid) {
    // if (1 == 1) { return true; }   // test - do not delete
    return GateWayfTicket.query()
      .delete()
      .where('id', tid)
      .then(() => {
        return true;
      })
      .catch(error => {
        log.error('Failed to delete ticket', {error: error.message});
        return false;
      });
  }

  garbageCollect(expires) {
    return GateWayfTicket.query()
      .select('*')
      .where('created', '<', expires)
      .then(result => {
        result.forEach(ticket => {
          this.delete(ticket.id);
          log.info('Garbage collect ticket', {
            id: ticket.id,
            created: ticket.created
          });
        });
        return true;
      })
      .catch(error => {
        log.error('Failed to garbage collect tickets', {error: error.message});
        return false;
      });
  }

  read(tid, ticket) { // eslint-disable-line no-unused-vars
    throw new Error(
      'Cannot use read in gatewayfticket. Use readUnencryptedData instead '
    );
  }

  static insert(tid, ticket) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot use insert in gatewayfticket');
  }

  static insertNext(ticket) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot use insertNext in gatewayfticket');
  }

  static update(tid, ticket) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot use update in gatewayfticket');
  }

  static upsert(tid, ticket) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot use upsert in gatewayfticket');
  }

  static find(tid) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot use find in gatewayfticket');
  }
}
