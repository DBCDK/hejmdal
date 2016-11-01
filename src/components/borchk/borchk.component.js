/**
 * @file
 *
 *
 */
import {form} from 'co-body';
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param ctx
 * @param user
 * @returns {*}
 */
export async function validateUserInLibrary(ctx, user) {
  let userValidate = false;
  try {
    const response = await getClient(user.libraryId, user.userId, user.pincode);
    userValidate = extractInfo(response);
  }
  catch (err) {
    log.error('Invalid service call', err);
    ctx.status = 403;
  }
  return userValidate;
}

/**
 * Retrieving borchk response through co-body module
 *
 * @param ctx
 * @return {{}}
 */
export async function getBorchkResponse(ctx) {
  let response = null;
  try {
    response = ctx.fakeBorchkPost ? ctx.fakeBorchkPost : await form(ctx);
  }
  catch (e) {
    log.error('Could not retrieve borchk response', {error: e.message, stack: e.stack});
  }

  return response;
}

/**
 * Parse result from borchk.
 * requestStatus can be:
 *   - ok,
 *   - service_not_licensed,
 *   - service_unavailable,
 *   - library_not_found,
 *   - borrowercheck_not_allowed,
 *   - borrower_not_found,
 *   - borrower_not_in_municipality,
 *   - municipality_check_not_supported_by_library,
 *   - no_user_in_request or
 *    - error_in_request
 *  Anything but ok is returned as false
 *
 * @param response
 * @returns {boolean}
 */
function extractInfo(response) {
  if (response && response.borrowerCheckResponse && response.borrowerCheckResponse.requestStatus) {
    return response.borrowerCheckResponse.requestStatus.$ === 'ok';
  }

  throw new Error('Invalid borchk response', response);
}


