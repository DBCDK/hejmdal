/**
 * @file
 *
 *
 */
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';
import {ERRORS} from '../../utils/errors.util';
import {identityProviderValidationFailed} from '../Identityprovider/identityprovider.component';
import * as blockLogin from '../BlockLogin/blocklogin.component';
import {borchkUserIdIsGlobal, isValidCpr, trimPossibleCpr} from '../../utils/cpr.util';
import {looksLikeAUserId} from '../../utils/userId.util';

/**
 * Validate a user against a given library, using the borchk service
 *
 * @param {object} serviceRequester
 * @param {object} userInput
 * @param retries
 * @returns {Promise<*|{error: boolean, message: string}|{error: boolean, message: string}>}
 */
export async function validateUserInLibrary(serviceRequester, userInput, retries = 0) {
  let userValidate;
  try {
    const response = await getClient(
      userInput.agency,
      userInput.userId,
      userInput.pincode,
      serviceRequester
    );

    userValidate = extractInfo(response, retries, 'Agency: ' + userInput.agency + ' serviceRequester: ' + serviceRequester);

    // Temporary fix: Borchk randomly returns service_unavailable. Retry once
    if (retries === 0 && userValidate.error && userValidate.message === 'sevua') {
      log.debug('Borchk unavailable - start retry', {
        body: JSON.stringify(response)
      });
      return validateUserInLibrary(serviceRequester, userInput, 1);
    }
  } catch (e) {
    log.error('Request to BORCHK failed', {error: e.message, stack: e.stack});
    userValidate = {message: ERRORS.service_unavailable, error: 'BORCHK fatal error: ' + e.message};
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
    message: 'unknown_error'
  };

  if (response && response.requestStatus) {
    const message = response.requestStatus;

    switch (message) {
      case 'ok':
        statusResponse.error = false;
        statusResponse.message = 'OK';
        statusResponse.blocked = response.blocked || false;
        statusResponse.municipalityNumber = response.municipalityNumber;
        statusResponse.userPrivilege = response.userPrivilege || [];
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

/**
 * Parses the callback parameters for borchk. Parameters from form comes as post
 *
 * @param req
 * @param res
 * @returns {*}
 */
export async function borchkCallback(req, res) {
  const requestUri = req.getState().serviceClient.borchkServiceName;
  const formData = req.fakeBorchkPost || req.body;
  const userId = formData && formData.loginBibDkUserId ? trimPossibleCpr(formData.loginBibDkUserId.trim(' ')) : null;
  formData.userId = userId;
  let validated = {error: true, message: 'unknown_error'};

  if (userId) {
    if (formData.agency && formData.pincode) {
      validated = await validateUserInLibrary(requestUri, formData);
    } else {
      validated.message = ERRORS.missing_fields;
    }
  }

  if (!validated.error) {
    await blockLogin.clearFailedUser(userId, formData.agency);
    await blockLogin.clearFailedIp(req.ip);
    const user = {
      userId: userId,
      cpr: (borchkUserIdIsGlobal(formData.agency) && isValidCpr(userId)) ? userId : null,
      userType: 'borchk',
      agency: formData.agency,
      pincode: formData.pincode,
      userValidated: true
    };
    if (formData.setStickyAgency) {
      const decadeInMs = 315360000000; // 1000*60*60*24*365*10 - close to 10 years
      res.cookie('stickyAgency', formData.agency, {expires: new Date(Date.now() + decadeInMs), httpOnly: true});
    }
    req.session.rememberMe = formData.rememberMe;
    req.setUser(user);
    return true;
  }
  blockClientUntilTime(
    res,
    await blockLogin.toManyLoginsFromIp(req.ip, validated.message)
  );
  const blockToTime = await blockLogin.toManyLoginsFromUser(
    userId,
    formData.agency,
    validated.message
  );
  if (blockToTime) {
    validated.message = 'tmul';
    blockClientUntilTime(res, blockToTime);
  } else {
    if (validated.message === 'bonfd' && !looksLikeAUserId(userId)) {
      validated.message = 'bonui';
    }
    identityProviderValidationFailed(
      req,
      res,
      validated,
      formData.agency,
      Math.min(
        await blockLogin.getLoginsLeftUserId(userId, formData.agency),
        await blockLogin.getLoginsLeftIp(req.ip)
      )
    );
  }
  return false;
}

/**
 * Show blocked page
 *
 * @param res
 * @param blockToTime
 */
function blockClientUntilTime(res, blockToTime) {
  const now = new Date();
  const blocked = blockToTime ? new Date(blockToTime) : now;
  if (blocked > now) {
    const blockMinutes = Math.ceil((blocked.getTime() - now.getTime()) / 60000);
    const minutesTxt =
      'Login blokeret i ' +
      blockMinutes +
      ' minut' +
      (blockMinutes !== 1 ? 'ter.' : '.');
    res.status(429);
    res.render('Blocked', {error: minutesTxt});
  }
}
