/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router

const router = new Router();

/**
 * Sets the session to null which will provoke the session to be destroyed.
 * After the session is destroyed the a message is shown to the user, unless a redirect paramter is present. If
 * that's the case the browser will be redirected to that.
 */
router.get('/logout', async (ctx, next) => {
  await next();
  ctx.session = null;

  if(ctx.request.query.redirect){
    ctx.redirect(ctx.request.query.redirect);
  } else {
    ctx.body = 'Du er nu logget ud';
  }
});

export default router;
