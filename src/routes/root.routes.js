/**
 * @file
 * Specifying the most simple routes
 */

import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';
import {CONFIG} from '../utils/config.util';

import {renderFrontPage} from '../components/FrontPage/frontpage.component';

import {wipeStores} from '../utils/test.util';

const router = new Router({prefix: VERSION_PREFIX});

router.get('/', (ctx, next) => {
  ctx.body = renderFrontPage();
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

if (CONFIG.app.env === 'test') {
  router.get('/test', (ctx, next) => {
    wipeStores();
    ctx.body = 'Tesh';
    next();
  });
}

export default router;
