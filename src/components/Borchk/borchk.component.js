/**
 * @file
 *
 *
 */
import {form} from 'co-body';
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';
import {ERRORS} from '../../utils/errors.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param {object} ctx
 * @param {object} userInput
 * @returns {*}
 */
export async function validateUserInLibrary(ctx, userInput) {
  let userValidate = {error: true, message: 'unknown_error'};

  try {
    const requester = ctx.getState().serviceClient.borchkServiceName;
    const response = await getClient(userInput.libraryId, userInput.userId, userInput.pincode, requester);
    userValidate = extractInfo(response);
  }
  catch (e) {
    log.error('Invalid service call', {error: e.message, stack: e.stack});
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
 *   - error_in_request
 *  Anything but ok is returned as {error: false}
 *
 * @param {object} response
 * @returns {{error: boolean, message: string}}
 */
function extractInfo(response) {
  let statusResponse = {
    error: true,
    message: 'unknown_error'
  };

  if (response && response.borrowerCheckResponse && response.borrowerCheckResponse.requestStatus) {
    switch (response.borrowerCheckResponse.requestStatus.$) {
      case 'ok':
        statusResponse.error = false;
        statusResponse.message = 'OK';
        break;
      case 'no_user_in_request':
        log.error('Invalid borchk request. Missing user', {response: response});
        statusResponse.message = ERRORS.no_user_in_request;
        break;
      case 'error_in_request':
        log.error('Invalid borchk request', {response: response});
        statusResponse.message = ERRORS.error_in_request;
        break;
      case 'library_not_found':
        log.error('Unknown borchk library', {response: response});
        statusResponse.message = ERRORS.library_not_found;
        break;
      default:
        break;
    }
  }
  else {
    log.error('Invalid borchk response', {response: response});
    statusResponse.message = 'invalid_borchk_response';
  }

  return statusResponse;
}


