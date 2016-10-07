/**
 * @file
 * Session utils
 */

/**
 * Returns the lifetime for session. If process.env.SESSION_LIFE_TIME is set and an integer it will be used, otherwise
 * the default value of 86400000 (24 hours) will be used.
 *
 * @return {number}
 */
export function getSessionLifeTime() {
  return Number.isInteger(Number(process.env.SESSION_LIFE_TIME)) ? process.env.SESSION_LIFE_TIME : 86400000;
}
