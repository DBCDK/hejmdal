/**
 * @file
 * Specifying the most simple routes
 */

import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';
import {renderFrontPage} from '../components/FrontPage/frontpage.component';
import sanityCheck from '../utils/sanityCheck.util';

const router = new Router({prefix: VERSION_PREFIX});

router.get('/', (ctx) => {
  ctx.body = renderFrontPage();
});

router.get('/health', async (ctx) => {

  const health = await sanityCheck();
  ctx.status = 200;
  ctx.body = health;
  if (health.filter(e => e.state === 'fail').length) {
    ctx.status = 503;
  }
});

router.get('/fejl', (ctx) => {
  const state = ctx.getState();
  let link = null;
  if (state && state.smaugToken) {
    link = {
      href: `${VERSION_PREFIX}/login?token=${state.smaugToken}`,
      value: 'Prøv igen'
    };
  }
  const error = 'Der er sket en fejl. Dette kan skyldes at du har klikket på et ugyldigt link.';
  ctx.render('Error', {error, link});
});

export default router;
