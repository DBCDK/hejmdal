/**
 * @file
 * Specifying the most simple routes
 */

import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';

import {renderFrontPage} from '../components/FrontPage/frontpage.component';

const router = new Router({prefix: VERSION_PREFIX});

router.get('/', async (ctx, next) => {
  ctx.body = renderFrontPage();
  await next();
});

router.get('/health', async (ctx, next) => {
  ctx.body = 'OK!';
  await next();
});

router.get('/fejl', async (ctx, next) => {
  ctx.body = 'Fejl!';
  await next();
});

export default router;
