/**
 * Initializes state object with dummy data
 *
 * @todo move state to session
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function initState(ctx, next) {
  // this is a hardcoded state object for development
  ctx.state = Object.assign({
    user: null,
    client: null,
    token: 'qwerty',
    returnUrl: '/fail',
    ticket: null
  }, ctx.state || {});

  next();
}
