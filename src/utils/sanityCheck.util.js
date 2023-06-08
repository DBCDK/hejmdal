/**
 * @file
 * Perform sanityCheck of external resources
 */

import User from '../models/db_models/user.model';
import * as Borchk from '../components/Borchk/borchk.client';
import * as Culr from '../components/Culr/culr.client';
import * as Smaug from '../components/Smaug/smaug.client';
import * as VipCore from '../components/VipCore/vipCore.client';
import * as DbcIdp from '../components/DBCIDP/dbcidp.client';

import {log} from './logging.util';
import startTiming from './timing.util';

/** Performs sanity check on dependencies. For the readiness probe, only db and smaug is critical
 *
 * @param level
 * @returns {Promise<[{ms: number, name: string, state: string}]|{name: string}[]>}
 */
export default async function sanityCheck(level = 'all') {
  if (level === 'ready') {
    return await Promise.all([
      wrap(checkDatabase, 'db'),
      wrap(checkSmaug, 'smaug')
    ]);
  }

  return await Promise.all([
    wrap(checkDatabase, 'db'),
    wrap(checkBorchk, 'borchk'),
    wrap(checkCulr, 'culr'),
    wrap(checkSmaug, 'smaug'),
    wrap(checkVipCore, 'vipCore'),
    wrap(checkDbcIdp, 'dbcIdp'),
  ]);
}

/**
 * Wraps sanity checks to return uniform responses
 * @param check
 * @param name
 * @returns {{name: string}}
 */
async function wrap(check, name) {
  const stopTiming = startTiming();
  let state = 'ok';
  let error;
  try {
    await check();
  } catch (e) {
    error = e.message;
    log.error(`call to ${name} failed during sanity check`, {
      error: e.message,
      stack: e.stack
    });
    state = 'fail';
  }
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'database',
    function: `health:${name}`,
    ms: elapsedTimeInMs
  });

  if (elapsedTimeInMs > 3000) {
    error = 'request took more than 3000 ms';
    state = 'fail';
  }
  return {name, state, ms: elapsedTimeInMs, errorMessage: error};
}

/**
 * Check if database is available
 */
function checkDatabase() {
  return User.query()
    .select('*')
    .limit(1);
}

/**
 * Check if Borchk webservice is responding
 */
async function checkBorchk() {
  const response = await Borchk.getClient('111111', '1111111111', '1111', 'check');
  if (!response || !response.userId) {
    throw Error('No valid response from borchk');
  }
}

/**
 * Check if CULR webservice is responding
 */
async function checkCulr() {
  const response = await Culr.getAccountsByGlobalId({uidValue: 'test'});
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
 * Check if VipCore webservice is responding
 */
async function checkVipCore() {
  return VipCore.libraryListFromName('test');
}

/**
 * Check if SMAUG webservice is responding
 */
async function checkDbcIdp() {
  const client = await DbcIdp.health();
  if (client.statusCode !== 200) {
    throw Error('DbcIdp is not responding');
  }
}
