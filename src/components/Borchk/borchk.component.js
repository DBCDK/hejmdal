/**
 * @file
 *
 *
 */
import {form} from 'co-body';
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';
import {ERRORS} from '../../utils/errors.util';
import {isValidCpr} from '../../utils/cpr.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param {object} ctx
 * @param {object} userInput
 * @returns {*}
 */
export async function validateUserInLibrary(requester, userInput) {
  let userValidate = {error: true, message: 'unknown_error'};

  const response = await getClient(
    userInput.libraryId,
    userInput.userId,
    userInput.pincode,
    requester
  );
  userValidate = extractInfo(response);

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
  } catch (e) {
    log.error('Could not retrieve borchk response', {
      error: e.message,
      stack: e.stack
    });
  }

  return response;
}

/**
 * Parses the callback parameters for borchk. Parameters from form comes as post
 *
 * @param req
 * @returns {*}
 */
export async function borchkCallback(requestUri, formData) {
  let validated = {error: true, message: 'unknown_eror'};

  if (formData && formData.userId && formData.libraryId && formData.pincode) {
    validated = await validateUserInLibrary(requestUri, formData);
  } else {
    validated.message = ERRORS.missing_fields;
  }

  if (!validated.error) {
    return {
      user: {
        userId: formData.userId,
        cpr: isValidCpr(formData.userId) ? formData.userId : null,
        userType: 'borchk',
        libraryId: formData.libraryId,
        pincode: formData.pincode,
        userValidated: true
      },
      rememberMe: formData.rememberMe
    };
  }
  return {error: validated, libraryId: formData.libraryId};
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

  if (
    response &&
    response.borrowerCheckResponse &&
    response.borrowerCheckResponse.requestStatus
  ) {
    const message = response.borrowerCheckResponse.requestStatus.$;
    switch (message) {
      case 'ok':
        statusResponse.error = false;
        statusResponse.message = 'OK';
        break;
      case 'service_not_licensed':
        log.error('Invalid borchk request. Service not licensed', {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'service_unavailable':
        log.error('Borchk service is unavailable', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'library_not_found':
        log.error('Borchk: The requested library was not found', {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'borrowercheck_not_allowed':
        log.error('Borchk: Borrowercheck is no allowed', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'borrower_not_found':
        log.error('Borchk: Borrower not found', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'borrower_not_in_municipality':
        log.error('Borchk: Borrower not in municipality', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'municipality_check_not_supported_by_library':
        log.error('Borchk: Municipality check not supported by library', {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'no_user_in_request':
        log.error('Invalid borchk request. Missing user', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'error_in_request':
        log.error('Invalid borchk request', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      default:
        log.error('Unknown borchk library', {response: response});
        break;
    }
  } else {
    log.error('Invalid borchk response', {response: response});
    statusResponse.message = 'invalid_borchk_response';
  }

  return statusResponse;
}
