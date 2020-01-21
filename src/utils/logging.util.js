import fs from 'fs';
import {hostname} from 'os';
import {version} from '../../package.json';

import {CONFIG} from './config.util';

const PRETTY_PRINT = CONFIG.log.pretty ? 2 : null; // eslint-disable-line no-process-env

/**
 * @returns current log level
 */
export function getCurrentLogLevel() {
  return CONFIG.log.level || 'INFO'; // eslint-disable-line no-process-env
}

/**
 * Convert a log level name to a corresponding numerical value
 *
 * @param logLevel log level to convert
 * @returns numerical log level
 */

function getNumericalLogLevel(logLevel) {
  var logLevels = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5
  };

  return logLevels[logLevel.toUpperCase()];
}

/**
 * Log as JSON to stdout
 *
 * @param {string} level log level
 * @param {string} msg message to log
 * @param {object} args map of additional key/values to log
 */
function doLog(level, msg, args = {}) {
  const currentNumericalLogLevel = getNumericalLogLevel(getCurrentLogLevel());
  const targetNumericalLogLevel = getNumericalLogLevel(level);

  if (currentNumericalLogLevel < targetNumericalLogLevel) {
    return; // level low, do nothing
  }

  var blob = {
    '@timestamp': new Date().toISOString(),
    '@version': 1,
    app: 'hejmdal',
    version: version,
    level: level.toUpperCase(),
    host: hostname(),
    pid: process.pid,
    env: CONFIG.app.env || 'dev'
  };

  if (msg) {
    blob.msg = msg;
  }

  /* eslint-disable no-console */
  console.log(
    JSON.stringify(Object.assign(blob, removeSecrets(args)), null, PRETTY_PRINT)
  );
  /* eslint-enable no-console */
}

/**
 * Remove user identifications from log object
 * @param obj
 * @returns {{}}
 */

let parent = null;
function removeSecrets(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      parent = key;
      cleaned[key] = removeSecrets(obj[key]);
    } else if (['userPincode', 'pincode', 'pinCode'].includes(key)) {
      cleaned[key] = '****';
    } else if (['cpr', 'userId', 'userIdValue', '$'].includes(key)) {
      if (key === '$') {
        if (parent === 'userId') {
          cleaned[key] = obj[key].substring(0, 6);
        } else {
          cleaned[key] = obj[key];
        }
      } else {
        cleaned[key] = obj[key].substring(0, 6);
      }
    } else {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
}

/**
 * return true if the given path is an existing directory, false
 * otherwise.
 */
export function isDir(path) {
  try {
    const stats = fs.lstatSync(path);
    if (stats.isDirectory()) {
      return true;
    }
  } catch (e) {
    doLog('warn', 'Failed checking for directory');
  }
  return false;
}

export const log = {
  log: doLog,
  info: (msg, args) => doLog('info', msg, args),
  warn: (msg, args) => doLog('warn', msg, args),
  error: (msg, args) => doLog('error', msg, args),
  debug: (msg, args) => doLog('debug', msg, args),
  trace: (msg, args) => doLog('trace', msg, args)
};
