/**
 * @file
 */

import buildReturnUrl from '../../utils/buildReturnUrl.util';
import {getGateWayfLogoutUrl} from '../GateWayf/gatewayf.component';
import {getClientInfoByToken} from '../Smaug/smaug.component';
import {deleteuser} from '../User/user.component';

/**
 *
 * Sets the session to null which will provoke the session to be destroyed.
 * If a returnurl is set, this will be used to create a link
 * For all Identity Providers used but borchk, show a message about closing browser to end sessions at the Identity Provider
 *
 * @param req
 * @param res
 * @param next
 */
export async function logout(req, res, next) {
  let returnUrl = '';
  let idpLogoutInfo = false;
  let idpLogoutUrl = '';
  let logoutInfoCode = '';
  const token = req.query.token;
  let serviceClient;
  if (token) {
    deleteuser(token);
    serviceClient = await getClientInfoByToken(token);
    req.setState({serviceClient});
  }
  const user = req.getUser();
  const state = req.getState();
  if (serviceClient && state) {
    if (user.identityProviders && !req.getState().logoutGatewayf && (user.identityProviders.includes('nemlogin') || user.identityProviders.includes('wayf'))) {
      req.setState({logoutGatewayf: true, returnUrl: req.query.returnurl || req.getState().returnUrl});
      idpLogoutUrl = getGateWayfLogoutUrl();
    }
    else {
      returnUrl = buildReturnUrl(req.getState());
      idpLogoutInfo = user.identityProviders && (user.identityProviders.includes('unilogin') || user.identityProviders.includes('wayf')) || null;
      if (serviceClient.logoutScreen === 'skip') {
        logoutInfoCode = 'logout';
        if (idpLogoutInfo) {
          logoutInfoCode = 'logout_close_browser';
        }
      }
    }
  }

  if (idpLogoutUrl) {
    res.redirect(idpLogoutUrl);
  }
  else {
    req.session.destroy();
    if (logoutInfoCode) {
      res.redirect(returnUrl + (returnUrl.indexOf('?') ? '?' : '&') + 'message=' + logoutInfoCode);
    }
    else {
      res.render('Logout', {
        idpLogoutInfo: idpLogoutInfo,
        returnurl: returnUrl,
        serviceName: serviceClient && serviceClient.name
      });
    }

  }

  next();
}
