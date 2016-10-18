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
  ctx.session = Object.assign({
    state: {
      consents: {},   // contains consent attributes for services [serviceName] = Array(attributes)
      culr: null,
      smaugToken: ctx.query.token || null,
      serviceClient: {},  // supplied by smaug, contains serviceId, (serviceName), Array(attributes) Array(identityProviders)
      returnUrl: ctx.query.returnurl || null
    },
    user: {}  // contains the userId, userIdType, identityProviders
  }, ctx.session || {});

  ctx.ticket = {};  // ticketId and ticketToken

  next();
}
