import {getClientFromSmaug} from '../../components/Smaug/smaug.component';

export async function verifyToken(ctx, next) {
  const data = {ok: false, expires: '1990-01-01', token: ctx.query.token};
  try {
    const client = await getClientFromSmaug(ctx.query.token);
    data.ok = true;
    data.expires = client.expires;
  }
  catch (e) {
    // catch expired/missing token
  }
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify(data);
  await next();
}
