/**
 * Check if user is logged in with a valid serviceProvider
 *
 * TODO: Should this be implementet in the authorize endpoint?
 *
 * @param ctx
 * @returns {boolean}
 */
export default function userIsLoggedIn(ctx) {
  const ips = isLoggedInWith(ctx);
  if (ips.length) {
    if (!ips.includes('borck')) {
      const link = getIdentityProviders(ctx.getState())[ips[0]].link;
      ctx.redirect(link);
    }
    return true;
  }
  return false;
}

/**
 * Returns the valid identityproviders a user is logged in with.
 *
 * @param ctx
 * @returns {*}
 */
function isLoggedInWith(ctx) {
  if (!ctx.hasUser()) {
    return [];
  }
  const identityProviders = ctx.getState().serviceClient.identityProviders;
  return ctx
    .getUser()
    .identityProviders.filter(ip => identityProviders.includes(ip));
}
