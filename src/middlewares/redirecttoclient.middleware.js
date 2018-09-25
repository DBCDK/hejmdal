/**
 * @file
 * Redirect user to service client on success.
 */

import buildReturnUrl from '../utils/buildReturnUrl.util';

export async function redirectToClient(ctx, res, next) {
  const state = ctx.getState();
  const {token, id} = state.ticket;
  if (token && id) {
    if (ctx.session.loginToProfile) {
      res.redirect(`/profile?token=${state.smaugToken}`);
    } else {
      res.redirect(buildReturnUrl(state, {token, id}));
    }
  } else {
    await next();
  }
}
