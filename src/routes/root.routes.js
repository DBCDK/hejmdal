import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router

const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'Hejmdal!';
  next();
});

router.get('/health', (ctx, next) => {
  ctx.body = 'OK!';
  next();
});

export default router;
