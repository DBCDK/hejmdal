/**
 * @file
 * Specifying the most simple routes
 */

import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {getVersionPrefix} from '../utils/version.util';

const versionPrefix = getVersionPrefix();
const router = new Router({prefix: versionPrefix});

router.get('/', (ctx, next) => {
  ctx.body = 'Hejmdal!';
  next();
});

router.get('/health', (ctx, next) => {
  ctx.body = 'OK!';
  next();
});

export default router;
