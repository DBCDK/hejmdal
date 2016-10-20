/**
 * For testing purposes
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default function ctxdump(ctx, next) {
  const body = ctx.body ? ctx.body : '';
  ctx.body = body + preDump(ctx.session, 'session') + preDump(ctx, 'ctx');   // For test
  return next();
}

function preDump(obj, txt) {
  return '<pre>\n' + txt + ':\n' + JSON.stringify(obj, null, 2) + '</pre>';
}
