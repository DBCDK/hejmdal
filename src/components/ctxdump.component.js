/**
 * For testing purposes
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function ctxdump(ctx, next) {
  const body = ctx.body ? ctx.body : '';
  ctx.body = body + '<pre>' +
    'ctx:\n' + JSON.stringify(ctx, null, 2) +
    '\nsession:\n' + JSON.stringify(ctx.session, null, 2) +
    '\nticket:\n' + JSON.stringify(ctx.ticket, null, 2) +
    '</pre>';   // For test
  return next();
}
