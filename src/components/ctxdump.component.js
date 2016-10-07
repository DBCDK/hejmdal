/**
 * For testing purposes
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function ctxdump(ctx, next) {
  ctx.body = JSON.stringify(ctx.state, null, '  ');   // For test
  return next();
}
