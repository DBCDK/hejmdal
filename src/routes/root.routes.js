/**
 * @file
 * Specifying the most simple routes
 */

import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';

const router = new Router({prefix: VERSION_PREFIX});

router.get('/', (ctx, next) => {
  ctx.body = 'Hejmdal!';
  next();
});

router.get('/health', (ctx, next) => {
  ctx.body = 'OK!';
  next();
});

router.get('/fejl', (ctx, next) => {
  ctx.body = 'Fejl!';
  next();
});

export default router;
