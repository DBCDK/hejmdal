/**
 * @file
 * Url utils.
 *
 */

import url from 'url';

/**
 * Get the baseurl from a full url.
 *
 * @export
 * @param {string} urlString a full url as a string.
 * @returns {string}
 */
export function getHost(urlString) {
  const parsedUrl = url.parse(urlString);
  return parsedUrl.host ? `${parsedUrl.protocol}//${parsedUrl.host}` : null;
}
