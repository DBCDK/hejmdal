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
  ctx.session.state = Object.assign({
    user: null,
    attributes: {
      providers: ['borchk', 'unilogin']
    },
    token: 'qwerty',
    ticket: null,
    service: 'testservice',
    consents: {},
    client: null,
    returnUrl: '/fail'
  }, ctx.session.state || {});

  next();
}
