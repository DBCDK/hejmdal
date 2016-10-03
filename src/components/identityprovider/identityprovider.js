import path from 'path';
import sendfile  from 'koa-sendfile';

export async function initialize(ctx, next) {
  if (!ctx.state) {
    ctx.state = {}
  }
  return next();
}

export async function authenticate(ctx, next) {
  ctx.state = {};
  if (true) {
    const filepath = path.join(__dirname, '../../../static/identityprovider.html');
    await sendfile(ctx, filepath);
    if (!ctx.status) {
      ctx.throw(404)
    }
  }
  return next();
}

export function callback(ctx, next) {
  ctx.state.user = {
    id: ctx.query.id,
    type: ctx.params.type,
    attributes: {
      unilogin: 'UNItestuser'
    }
  };
  ctx.body = ctx.state;
  next();
}
