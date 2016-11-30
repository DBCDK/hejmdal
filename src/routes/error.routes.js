import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';

const router = new Router({prefix: VERSION_PREFIX + '/error'});

router.get('/', async (ctx, next) => {
  console.log('error');
  ctx.render('Error');
});

export default router;
