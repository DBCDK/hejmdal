/**
 * @file
 *
 * Validate a user against a given library, using the borchk service
 *
 */
import {getClient} from './borchk.client';
import {log} from '../../utils/logging.util';

/**
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function validateUserInLibrary(ctx, next) {
  try {
    const user = ctx.getState().user;
    const response = await getClient(user.library, user.userId, user.pinCode);
    user.userValidate = extractInfo(response);
    ctx.setState({user: user});
    return next();
  }
  catch (err) {
    log.error('Invalid service call', err);
    ctx.status = 403;
  }
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


