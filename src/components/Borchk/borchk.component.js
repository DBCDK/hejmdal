/**
 * @file
 *
 *
 */
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';
import {ERRORS} from '../../utils/errors.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param {object} serviceRequester
 * @param {object} userInput
 * @param retries
 * @returns {Promise<*|{error: boolean, message: string}|{error: boolean, message: string}>}
 */
export async function validateUserInLibrary(
  serviceRequester,
  userInput,
  retries = 0
) {
  const response = await getClient(
    userInput.agency,
    userInput.userId,
    userInput.pincode,
    serviceRequester
  );

  const userValidate = extractInfo(response, retries, 'Agency: ' + userInput.agency + ' serviceRequester: ' + serviceRequester);

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
 * @param retries
 * @param {string} requesterInfo
 * @returns {{error: boolean, message: string}}
 */
function extractInfo(response, retries = 0, requesterInfo) {
  let statusResponse = {
    error: true,
    message: 'unknown_error',
    blocked: false,
    userPrivilege: {}
  };

  if (response && response.requestStatus) {
    const message = response.requestStatus;

    switch (message) {
      case 'ok':
        statusResponse.error = false;
        statusResponse.message = 'OK';
        statusResponse.blocked = response.blocked;
        statusResponse.municipalityNumber = response.municipalityNumber;
        statusResponse.userPrivilege = response.userPrivilege;
        break;
      case 'service_not_licensed':
        log.error('Invalid borchk request. Service not licensed. ' + requesterInfo, {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'service_unavailable':
        log.error('Borchk service is unavailable' + requesterInfo, {
          response: response,
          retries
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'library_not_found':
        log.warn('Borchk: The requested library was not found. ' + requesterInfo, {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'borrowercheck_not_allowed':
        log.warn('Borchk: Borrowercheck is no allowed. ' + requesterInfo, {
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
        log.debug('Borchk: Municipality check not supported by library. ' + requesterInfo, {
          response: response
        });
        statusResponse.message = ERRORS[message];
        break;
      case 'no_user_in_request':
        log.error('Invalid borchk request. Missing user', {response: response});
        statusResponse.message = ERRORS[message];
        break;
      case 'error_in_request':
        log.error('Invalid borchk request. ' + requesterInfo, {response: response});
        statusResponse.message = ERRORS[message];
        break;
      default:
        log.error('Unknown borchk library. ' + requesterInfo, {response: response});
        break;
    }
  } else {
    log.error('Invalid borchk response', {response: response});
    statusResponse.message = 'invalid_borchk_response';
  }

  return statusResponse;
}
