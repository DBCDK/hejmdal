/**
 * @file
 * Perform sanityCheck of external resources
 */

import Session from '../models/db_models/session.model';
import * as Borchk from '../components/Borchk/borchk.client';
import * as Culr from '../components/Culr/culr.client';
import * as Smaug from '../components/Smaug/smaug.client';
import * as OpenAgency from '../components/OpenAgency/openAgency.client';

import {log} from './logging.util';

export default async function sanityCheck() {
  return await Promise.all([
    wrap(checkDatabase, 'db'),
    wrap(checkBorchk, 'borchk'),
    wrap(checkCulr, 'culr'),
    wrap(checkSmaug, 'smaug'),
    wrap(checkOpenAgency, 'openAgency')
  ]);
}

/**
 * Wraps sanity checks to return uniform responses
 * @param check
 * @param name
 * @returns {{name: string}}
 */
async function wrap(check, name) {
  let state = 'ok';
  try {
    await check();
  }
  catch (e) {
    log.error(`call to ${name} failed during sanity check`, {error: e.message, stack: e.stack});
    state = 'fail';
  }

  return {name, state};
}

/**
 * Check if database is available
 */
function checkDatabase() {
  return Session.query().count('*');
}

/**
 * Check if Borchk webservice is responding
 */
async function checkBorchk() {
  const response = await Borchk.getClient('check', 'check', 'check', 'check');
  if (!response.borrowerCheckResponse) {
    throw Error('No valid response from borchk');
  }
}

/**
 * Check if CULR webservice is responding
 */
async function checkCulr() {
  const response = await Culr.getAccounts({userIdValue: 'test'});
  if (!response.result) {
    throw Error('No valid response from borchk', response);
  }
}

/**
 * Check if SMAUG webservice is responding
 */
async function checkSmaug() {
  const client = await Smaug.health();
  if (client.statusCode !== 200) {
    throw Error('Smaug is not responding');
  }
}

/**
 * Check if OpenAgency webservice is responding
 */
async function checkOpenAgency() {
  return OpenAgency.libraryListFromName('test');
}

