/**
 * @file
 * Perform sanityCheck of external resources
 */

import Session from '../models/db_models/session.model';
import {log} from './logging.util';

export default function sanityCheck() {
  checkDatabase();
}

export function checkDatabase() {
  Session.query().count('*')
    .catch((e) => {
      log.error('Query failed', {error: e.message, stack: e.stack});
    });
}
