/**
 * @file
 */

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

  if (ctx.session.state) {
    ctx.getUser().identityProviders.forEach((idp) => {
      if (idp !== 'borchk') {
        idpLogoutInfo = true;
      }
    });
    returnUrl = ctx.query.returnurl ? ctx.getState().serviceClient.urls.host + ctx.query.returnurl : '';
    serviceName = ctx.getState().serviceClient.name;
    loginFound = true;
  }

  ctx.session = null;

  ctx.render('Logout', {
    idpLogoutInfo: idpLogoutInfo,
    loginFound: loginFound,
    returnurl: returnUrl,
    serviceName: serviceName
  });

  await next();
}
