/**
 * For testing purposes
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function ctxdump(ctx, next) {
  const body = ctx.body ? ctx.body : '';
  ctx.body = body + '<pre>' + JSON.stringify(ctx.session.state, null, 2) + '</pre>';   // For test
  return next();
}
