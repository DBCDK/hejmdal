import koa from 'koa';
import router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {log} from './utils/logging';

export function startServer() {
  const app = koa();
  const Router = router();
  const port = process.env.PORT || 3010; // eslint-disable-line no-process-env

  app.use(LoggerMiddleware());

  Router.get('/', function *(next) {
    this.body = 'Hejmdal!';
    yield next;
  });

  Router.get('/status', function *(next) {
    this.body = 'OK!';
    yield next;
  });

  app.use(Router.routes());

  app.on('error', function(err, ctx) {
    log.error('Server error', {error: err, ctx: ctx});
  });

  app.listen(port, () => {
    log.debug(`Server is up and running on port ${port}!`);
  });
}
