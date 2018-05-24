/**
 * @file
 * Redirect user to service client on success.
 */

import buildReturnUrl from '../utils/buildReturnUrl.util';

export async function redirectToClient(ctx, next) {
  const state = ctx.getState();
  const {token, id} = state.ticket;
  if (token && id) {
    if (ctx.session.loginToProfile) {
      ctx.redirect('/profile');
    }
    else {
      ctx.redirect(buildReturnUrl(state, {token, id}));
    }
  }
  else {
    await next();
  }
}
