import koa from 'koa';
import router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import http from 'http';
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {log} from './utils/logging';

export function startServer() {
  const app = koa();
  const Router = router();
  const server = http.createServer(app.callback());
  const port = process.env.PORT || 3010; // eslint-disable-line no-process-env

  app.use(LoggerMiddleware());

  Router.get('/', function *(next) {
    this.body = 'Hejmdal!';
    yield next;
  });

  app.use(Router.routes());

  app.on('error', function(err, ctx) {
    log.error('Server error', {error: err, ctx: ctx});
  });

  server.listen(port, () => {
    log.debug(`Server is up and running on port ${port}!`);
  });
}
