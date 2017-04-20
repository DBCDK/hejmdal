/**
 * @deprecated use setDefaultState in state.middleware instead
 * Initializes state object with dummy data
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export async function initState(ctx, next) {
  // this is a hardcoded state object for development
  ctx.session = Object.assign({
    state: {
      consents: {},   // contains consent attributes for services [serviceName] = Array(attributes)
      culr: null,
      returnUrl: ctx.query.returnurl || null,
      serviceAgency: ctx.query.agency || null,
      serviceClient: {},  // supplied by smaug, contains serviceId, (serviceName), Array(attributes) Array(identityProviders)
      smaugToken: ctx.query.token || null
    },
    user: {}  // contains the userId, userIdType, identityProviders
  }, ctx.session || {});

  ctx.ticket = {};  // ticketId (id) and ticketToken (token) and/or attributes object

  await next();
}
