/**
 * @file
 */

import buildReturnUrl from '../../utils/buildReturnUrl.util';
import {getGateWayfLogoutUrl} from '../GateWayf/gatewayf.component';
import {getClientInfo} from '../Smaug/smaug.component';

/**
 *
 * Sets the session to null which will provoke the session to be destroyed.
 * If a returnurl is set, this will be used to create a link
 * For all Identity Providers used but borchk, show a message about closing browser to end sessions at the Identity Provider
 *
 * @param ctx
 * @param next
 */
export async function logout(ctx, next) {
  let returnUrl = '';
  let idpLogoutInfo = false;
  let idpLogoutUrl = '';
  let logoutInfoCode = '';
  const token = ctx.query.token;
  const serviceClient = await getClientInfo(token);
  ctx.setState({serviceClient});
  const user = ctx.getUser();
  const state = ctx.getState();
  if (serviceClient && state) {
    if (user.identityProviders && !ctx.getState().logoutGatewayf && (user.identityProviders.includes('nemlogin') || user.identityProviders.includes('wayf'))) {
      ctx.setState({logoutGatewayf: true, returnUrl: ctx.query.returnurl || ctx.getState().returnUrl});
      idpLogoutUrl = getGateWayfLogoutUrl();
    }
    else {
      returnUrl = buildReturnUrl(ctx.getState());
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
    ctx.redirect(idpLogoutUrl);
  }
  else {
    ctx.session = null;

    if (logoutInfoCode) {
      ctx.redirect(returnUrl + (returnUrl.indexOf('?') ? '?' : '&') + 'message=' + logoutInfoCode);
    }
    else {
      ctx.render('Logout', {
        idpLogoutInfo: idpLogoutInfo,
        returnurl: returnUrl,
        serviceName: serviceClient && serviceClient.name
      });
    }

  }

  await next();
}
