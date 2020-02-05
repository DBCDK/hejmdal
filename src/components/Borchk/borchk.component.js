/**
 * @file
 *
 *
 */
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';
import {ERRORS} from '../../utils/errors.util';
import startTiming from '../../utils/timing.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param {object} serviceRequester
 * @param {object} userInput
 * @returns {*}
 */
export async function validateUserInLibrary(
  serviceRequester,
  userInput,
  retries = 0
) {
  let userValidate = {error: true, message: 'unknown_error'};
  const stopTiming = startTiming();
  const response = await getClient(
    userInput.agency,
    userInput.userId,
    userInput.pincode,
    serviceRequester
  );
  const elapsedTimeInMs = stopTiming();
  log.debug('timing', {
    service: 'BorChk',
    function: 'validateUserInLibrary',
    ms: elapsedTimeInMs
  });
  userValidate = extractInfo(response, retries);

  // Temporary fix: Borchk randomly returns service_unavailable. Retry once
  if (retries === 0 && userValidate.error && userValidate.message === 'sevua') {
    log.debug('Borchk unavailable - start retry', {
      body: JSON.stringify(response)
    });
    return validateUserInLibrary(serviceRequester, userInput, 1);
  }

  return userValidate;
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
function extractInfo(response, retries = 0) {
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
        log.error('Borchk service is unavailable', {
          response: response,
          retries
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'library_not_found':
        log.warn('Borchk: The requested library was not found', {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'borrowercheck_not_allowed':
        log.warn('Borchk: Borrowercheck is no allowed', {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'borrower_not_found':
        log.debug('Borchk: Borrower not found', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'borrower_not_in_municipality':
        log.debug('Borchk: Borrower not in municipality', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'municipality_check_not_supported_by_library':
        log.debug('Borchk: Municipality check not supported by library', {
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
