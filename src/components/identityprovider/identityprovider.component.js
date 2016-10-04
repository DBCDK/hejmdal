import crypto from 'crypto';
import index from './templates/index.template';
import borchk from './templates/borchk.template';
import nemlogin from './templates/nemlogin.template';
import unilogin from './templates/unilogin.template';

const templates = {index, borchk, nemlogin, unilogin};
const salt = 'thisisnotAsalt';


/**
 * Create a new token.
 *
 * @param value
 * @returns {*}
 */
function createToken(value) {
  return crypto
    .createHash('md5')
    .update(`${salt}${value}`)
    .digest('hex');
}

/**
 * Validate token against value.
 *
 * @param token
 * @param value
 * @returns {boolean}
 */
function verifyToken(token, value) {
  return token === crypto
      .createHash('md5')
      .update(`${salt}${value}`)
      .digest('hex');
}

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
    },
    token: 'qwerty',
    service: 'testservice'
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
      const authToken = createToken(ctx.state.token);
      const content = ctx.state.attributes.providers.map(value => templates[value](authToken)).join('');
      ctx.body = index({title: 'Log ind via ...', content});
      ctx.status = 200;
    }
  }
  catch (e) {
    ctx.status = 404;
  }
  return next();
}

/**
 * Callback function from external identityproviders
 *
 * @param ctx
 * @param next
 */
export function identityProviderCallback(ctx, next) {
  try {
    if (!verifyToken(ctx.params.token, ctx.state.token)) {
      ctx.status = 403;
      return next();
    }
    ctx.state.user = {
      id: ctx.query.id,
      type: ctx.params.type,
      query: ctx.query
    };
    ctx.body = ctx.state;
  }
  catch (e) {
    ctx.status = 500;
  }

  next();
}
