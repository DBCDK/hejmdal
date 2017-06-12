/**
 * @file
 */

import validate from 'validate.js';

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
  let returnUrl;
  let serviceName;
  let loginFound = false;
  let idpLogoutInfo = false;

  if (ctx.query.returnurl && !validate({website: ctx.query.returnurl}, {website: {url: {allowLocal: true, url: true}}})) {
    returnUrl = ctx.query.returnurl;
  }

  if (ctx.session.state && ctx.getUser().identityProviders) {
    loginFound = true;

    ctx.getUser().identityProviders.forEach((idp) => {
      if (idp !== 'borchk') {
        idpLogoutInfo = true;
      }
    });

    if (!returnUrl) {
      returnUrl = ctx.query.returnurl ? ctx.getState().serviceClient.urls.host + ctx.query.returnurl : '';
      serviceName = ctx.getState().serviceClient.name;
    }
  }

  ctx.session = null;

  ctx.render('Logout', {
    idpLogoutInfo: idpLogoutInfo,
    loginFound: loginFound,
    returnurl: returnUrl,
    serviceName: serviceName || returnUrl
  });

  await next();
}
