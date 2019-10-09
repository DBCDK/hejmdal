/**
 * @file
 */
import buildReturnUrl from '../../utils/buildReturnUrl.util';
import {getGateWayfLogoutUrl} from '../GateWayf/gatewayf.component';
import {getClientInfoByToken} from '../Smaug/smaug.component';
import {deleteuser} from '../User/user.component';
import {log} from '../../utils/logging.util';

/**
 * Validate if token and redirect_uri are valid.
 *
 * @param req
 * @param res
 * @param next
 */

export async function validateToken(req, res, next) {
  const {access_token, redirect_uri} = req.query;
  const {clients = [], state = {}} = req.session;
  console.log(clients);
  let serviceClient;
  try {
    if (access_token) {
      deleteuser(access_token);
      serviceClient = await getClientInfoByToken(access_token);
      if (redirect_uri && serviceClient.redirectUris.includes(redirect_uri)) {
        req.setState({redirect_uri});
      }
    } else if (
      redirect_uri &&
      clients.filter(client => client.redirectUris.includes(redirect_uri))
        .length > 0
    ) {
      req.setState({redirect_uri});
    }
  } catch (e) {
    log.debug('Validate token failed', {
      errorMessage: e.message,
      stack: e.stack
    });
  }

  req.setState({serviceClient});
  next();
}

/**
 * If a user is logged in throught gatewayf, then query params are saved in session and user is redirected to gatewayf logout url.
 *
 * @param req
 * @param res
 * @param next
 */
export function gateWayfLogout(req, res, next) {
  const {identityProviders} = req.getUser() || {};
  const {logoutGatewayf} = req.getState();
  if (identityProviders) {
    if (
      identityProviders &&
      !logoutGatewayf &&
      (identityProviders.includes('nemlogin') ||
        identityProviders.includes('wayf'))
    ) {
      req.setState({logoutGatewayf: true});
      return res.redirect(getGateWayfLogoutUrl());
    }
  }
  next();
}

/**
 * Returns info message code.
 *
 * @param {Array} identityProviders
 */
function getLogoutInfoCode(identityProviders) {
  if (
    identityProviders &&
    (identityProviders.includes('unilogin') ||
      identityProviders.includes('wayf'))
  ) {
    return 'logout_close_browser';
  }
  return 'logout';
}

/**
 * Logs out the user from Hejmdal.
 *
 * If a redirect_uri is set, this will be used to create a link
 * For all Identity Providers used but borchk, show a message about closing browser to end sessions at the Identity Provider
 *
 * @param req
 * @param res
 * @param next
 */
export function logout(req, res, next) {
  try {
    const state = req.getState();
    const {serviceClient, redirect_uri} = state;
    const {identityProviders} = req.getUser() || {};

    req.session.destroy(() => {
      if (redirect_uri) {
        res.redirect(
          redirect_uri +
            (redirect_uri.indexOf('?') ? '?' : '&') +
            'message=' +
            getLogoutInfoCode(identityProviders)
        );
      } else {
        res.render('Logout', {
          returnurl: (serviceClient && buildReturnUrl(state)) || null,
          serviceName: (serviceClient && serviceClient.name) || ''
        });
      }
    });
  } catch (e) {
    next(e);
    log.error('Error logging out', {error: e.message, stack: e.stack});
  }
}

/**
 * Logs the user out of hejmdal, and all registered clients, the user has logged into.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */

export function singleLogout(req, res, next) {
  const {clients = [], state = {}} = req.session;
  const {singlelogout} = req.query;
  if (!singlelogout || clients.length < 2) {
    return next();
  }
  try {
    let {serviceClient, redirect_uri} = state;
    const {identityProviders} = req.getUser() || {};

    if (redirect_uri) {
      redirect_uri = `${redirect_uri}${
        redirect_uri.indexOf('?') ? '?' : '&'
      }message=${getLogoutInfoCode(identityProviders)}`;
    }
    const link = (serviceClient && buildReturnUrl(state)) || null;
    const serviceName = (serviceClient && serviceClient.name) || '';
    req.session.destroy(() => {
      res.render('SingleLogout', {clients, redirect_uri, link, serviceName});
    });
  } catch (e) {
    next(e);
    log.error('Error doing Single logout', {error: e.message, stack: e.stack});
  }
}
