import {version} from '../../package.json';
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router

// prefix for the API-endpoint, ie /v0, /v1, or ..
const versionPrefix = '/v' + parseInt(version, 10);

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
