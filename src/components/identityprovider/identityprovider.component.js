import index from './templates/index.template';
import borchk from './templates/borchk.template';
import nemlogin from './templates/nemlogin.template';
import unilogin from './templates/unilogin.template';

const templates = {index, borchk, nemlogin, unilogin};

/**
 * Initializes state object.
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function initialize(ctx, next) {
  // this is a hardcoded state object for testing
  ctx.state = Object.assign({
    user: null,
    attributes: {
      providers: ['borchk', 'unilogin']
    }
  }, ctx.state || {});
  return next();
}

/**
 * Returns Identityprovider screen if user is not logged in.
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export function authenticate(ctx, next) {

  try {
    if (!ctx.state.user) {
      const content = ctx.state.attributes.providers.map(value => templates[value]()).join('');
      ctx.body = index({title: 'Log ind via ...', content});
      ctx.status = 200;
    }
  } catch (e) {
    console.log(e);
    ctx.status = 404;
  }
  console.log(next);
  return next();
}

/**
 * Callback function from external identityproviders
 *
 * @param ctx
 * @param next
 */
export function identityProviderCallback(ctx, next) {
  ctx.state.user = {
    id: ctx.query.id,
    type: ctx.params.type,
    query: ctx.query
  };
  ctx.body = ctx.state;
  next();
}
