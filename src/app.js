import Koa from 'koa';
import serve from 'koa-static';
import router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import convert from 'koa-convert';
import responseTime from 'koa-response-time';
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {log} from './utils/logging';

export function startServer() {
  const app = new Koa();
  const Router = router();
  const PORT = process.env.PORT || 3010; // eslint-disable-line no-process-env

  app.use(convert(responseTime())); // This middleware should be placed as the very first to ensure that responsetime is correctly calculated
  app.use(LoggerMiddleware);

  app.use(convert(serve('./static')));

  Router.get('/', (ctx, next) => {
    ctx.body = 'Hejmdal!';
    next();
  });

  Router.get('/health', (ctx, next) => {
    ctx.body = 'OK!';
    next();
  });

  app.use(Router.routes());

  app.on('error', function(err, ctx) {
    log.error('Server error', {error: err, ctx: ctx});
  });

  app.listen(PORT, () => {
    log.debug(`Server is up and running on port ${PORT}!`);
  });
}
