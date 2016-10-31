/**
 * @file
 */

import {form} from 'co-body';
import {log} from '../../utils/logging.util';

/**
 * Retrieving wayf response through co-body module
 *
 * @param ctx
 * @returns {{userId: *}}
 */
export async function getWayfResponse(ctx) {
  let cpr = null;
  try {
    const match = ':CPR:';
    const wayfObj = ctx.fakeWayfPost ? ctx.fakeWayfPost : await form(ctx);
    if (Array.isArray(wayfObj.schacPersonalUniqueID)) {
      const cprPos = wayfObj.schacPersonalUniqueID[0].indexOf(match);
      if (cprPos !== -1) {
        cpr = wayfObj.schacPersonalUniqueID[0].substr(cprPos + match.length);
      }
    }
  }
  catch (e) {
    log.error('Could not retrieve wayf response', {error: e.message, stack: e.stack});
  }

  return {userId: cpr};

}
