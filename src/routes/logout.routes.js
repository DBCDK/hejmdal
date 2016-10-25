/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';


const router = new Router({prefix: VERSION_PREFIX});

/**
 * Sets the session to null which will provoke the session to be destroyed.
 * After the session is destroyed a message is shown to the user, unless a redirect paramter is present. If
 * that's the case the browser will be redirected to that.
 */
router.get('/logud', async (ctx, next) => {
  ctx.session = null;

  if (ctx.request.query.redirect) {
    ctx.redirect(ctx.request.query.redirect);
  }
  else {
    ctx.body = 'Du er nu logget ud';
  }

  await next();
});

export default router;
