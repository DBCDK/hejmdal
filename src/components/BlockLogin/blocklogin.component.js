/**
 * @file
 *
 * Functions to handle failed logins
 *
 * Handle 2 schemes, one for failed identical ip attemps and one for failed dentical userId attemps
 *
 * Block ip visits when some thresshold is met and then increase blocked period slightly over time
 * Block attempt on the same userId when thresshold is met
 * Successfull login will reset (clear) ip and userId login attemts information
 *
 */

import PersistentFailedLoginStorage from '../../models/FailedLogin/failedlogin.persistent.storage.model';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import MemoryStorage from '../../models/memory.storage.model';
import {CONFIG} from '../../utils/config.util';

const storage = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentFailedLoginStorage());

const failedSettings = CONFIG.failedLogin;
const gcFailed = {divisor: CONFIG.garbageCollect.failedLogin.divisor, seconds: CONFIG.garbageCollect.failedLogin.seconds};

/**
 * if user is blocked, return date when blocking is dropped
 *
 * @param userId
 * @param agency
 * @param message
 * @returns {Promise<*>}
 */
export async function toManyLoginsFromUser(userId, agency, message) {
  garbageCollect();
  return await toManyLogins(userId + agency, failedSettings.userId, isUserFailure(message, 'user'));
}

/**
 * if ip is blocked, return date when blocking is dropped
 *
 * @param ip
 * @param message
 * @returns {Promise<*>}
 */
export async function toManyLoginsFromIp(ip, message) {
  return await toManyLogins(ip, failedSettings.ip, isUserFailure(message, 'ip'));
}

/**
 * return login left for a given userId
 *
 * @param userId
 * @param agency
 * @returns {Promise<number>}
 */
export async function getLoginsLeftUserId(userId, agency) {
  return await getLoginsLeft(userId + agency, failedSettings.userId);
}

/**
 * return login left for a given ip
 *
 * @param ip
 * @returns {Promise<number>}
 */
export async function getLoginsLeftIp(ip) {
  return await getLoginsLeft(ip, failedSettings.ip);
}

/**
 * clear failed login attemps
 *
 * @param userId
 * @param agency
 * @returns {Promise<void>}
 */
export async function clearFailedUser(userId, agency) {
  return await clearFailed(userId + agency);
}

/**
 * clear failed login attemps
 *
 * @param ip
 * @returns {Promise<void>}
 */
export async function clearFailedIp(ip) {
  return await clearFailed(ip);
}

/* ********************** private ******************* */

/**
 * Garbage collect failed logins
 *
 * @returns {boolean}
 */
async function garbageCollect() {
  storage.garbageCollect(gcFailed.divisor, gcFailed.seconds);
  return true;
}

/**
 * if key is blocked, return date when blocking is dropped
 *  The length of the blocking is increased for continous failed login within the reset time frame
 *
 * @param key
 * @param settings
 * @param userFailed
 * @returns {*}
 */
async function toManyLogins(key, settings, userFailed) {
  const now = new Date().getTime();
  const fail = await storage.read(key);
  if (fail && (now - fail.timeStamp > (settings.resetSeconds * 1000))) {
    await clearFailed(key);
    fail.count = 0;
  }
  if (fail && fail.count >= settings.maxFail) {
    const blockMilliSeconds = settings.blockSeconds * 1000 * Math.floor(Math.pow(fail.count, 1.5) / settings.maxFail);
    const blockedTo = new Date(fail.timeStamp + blockMilliSeconds).getTime();
    if (blockedTo > now) {
      return blockedTo;
    }
  }
  if (userFailed) {
    await incrementFailed(key, settings);
  }
  return false;
}

/**
 * return logins left
 *
 * @param key
 * @param settings
 */
async function getLoginsLeft(key, settings) {
  const fail = await storage.read(key);
  const fails = fail ? fail.count : 0;
  return Math.max(0, settings.maxFail - fails + 1);
}

/**
 * increment failed login attemps
 *
 * @param key
 * @param settings
 */
async function incrementFailed(key, settings) {
  const fail = await storage.read(key);
  const fails = {timeStamp: new Date().getTime(), count: (fail ? fail.count + 1 : 1)};
  await storage.update(key, fails);
  return await getLoginsLeft(key, settings);
}

/**
 *
 * @param key
 */
async function clearFailed(key) {
  if (key) {
    await storage.delete(key);
  }
}

/**
 * Return true if the user made an error
 *
 * @param message
 * @param failType
 * @returns {boolean|boolean}
 */
function isUserFailure(message, failType) {
  return (failType === 'user' && message === 'bonfd') || (failType === 'ip' && message === 'bonfd');
}
