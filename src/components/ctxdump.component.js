/**
 * For testing purposes
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function ctxdump(ctx, next) {
  const body = ctx.body ? ctx.body : '';
  ctx.body = body + preDump(ctx, 'ctx') + preDump(ctx.session, 'session') + preDump(ctx.ticket, 'ticket');   // For test
  return next();
}

function preDump(obj, txt) {
  return '<pre>\n' + txt + ':\n' + JSON.stringify(obj, null, 2) + '</pre>';
}
