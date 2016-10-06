import {version} from '../../package.json';

export const VERSION = version;

export function getVersionPrefix() {
  // prefix for the API-endpoint, ie /v0, /v1, or ..
  return '/v' + parseInt(version, 10);
}
