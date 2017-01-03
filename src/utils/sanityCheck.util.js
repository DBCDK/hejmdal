/**
 * @file
 * Perform sanityCheck of external resources
 */

import Session from '../models/db_models/session.model';
import * as Borchk from '../components/Borchk/borchk.client';
import * as Culr from '../components/Culr/culr.client';
import * as Smaug from '../components/Smaug/smaug.client';

import {log} from './logging.util';

export default async function sanityCheck() {
  checkDatabase();
  checkBorchk();
  checkCulr();
  checkSmaug();
}

/**
 * Check if database is available
 */
export function checkDatabase() {
  Session.query().count('*')
    .catch((e) => {
      log.error('Query failed', {error: e.message, stack: e.stack});
    });
}

/**
 * Check if Borchk webservice is responding
 */
export function checkBorchk() {
  Borchk.getClient('check', 'check', 'check', 'check').then(res => {
    if (!res.borrowerCheckResponse) {
      throw Error('No valid response from borchk');
    }
  }).catch(e => {
    log.error('Borchk is failing', {error: e.message, stack: e.stack});
  });
}

/**
 * Check if CULR webservice is responding
 */
export async function checkCulr() {
  try {
    const response = await Culr.getAccounts({userIdValue: 'test'});
    if (!response.result) {
      throw Error('No valid response from borchk', response);
    }

  }
  catch (e) {
    log.error('Request to CULR failed', {error: e.message, stack: e.stack});
  }
}

/**
 * Check if SMAUG webservice is responding
 */
export async function checkSmaug() {
  try {
    const client = await Smaug.health();
    if (client.statusCode !== 200) {
      throw Error('Smaug is not r$esponding');
    }

  }
  catch (e) {
    log.error('Request to Smaug failed', {error: e.message, stack: e.stack});
  }
}

