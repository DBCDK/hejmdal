/**
 * @file
 */

import buildReturnUrl from '../../utils/buildReturnUrl.util';
import {getGateWayfLogoutUrl} from '../GateWayf/gatewayf.component';

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
  let serviceName;
  let loginFound = false;
  let idpLogoutInfo = false;
  let idpLogoutUrl = '';

  const user = ctx.getUser();
  if (ctx.session.state && user) {
    loginFound = true;
    if (!ctx.getState().logoutGatewayf && (user.identityProviders.includes('nemlogin') || user.identityProviders.includes('wayf'))) {
      ctx.setState({logoutGatewayf: true, returnUrl: ctx.query.returnurl || ctx.getState().returnUrl});
      idpLogoutUrl = getGateWayfLogoutUrl();
    }
    else {
      if (ctx.query.returnurl) {
        ctx.setState({returnUrl: ctx.query.returnurl});
      }
      returnUrl = buildReturnUrl(ctx.getState());
      idpLogoutInfo = (user.identityProviders.includes('unilogin') || user.identityProviders.includes('wayf'));
      serviceName = ctx.getState().serviceClient.name;
    }
  }

  if (idpLogoutUrl) {
    ctx.redirect(idpLogoutUrl);
  }
  else {
    ctx.session = null;

    ctx.render('Logout', {
      idpLogoutInfo: idpLogoutInfo,
      loginFound: loginFound,
      returnurl: returnUrl,
      serviceName: serviceName
    });
  }

  await next();
}
