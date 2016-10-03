/**
 * @file
 * Configure and start our server
 */

// Config
import {version} from '../package.json';

// Libraries
import koa from 'koa';
import serve from 'koa-static';
import router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import cors from 'koa-cors'; // @see https://github.com/evert0n/koa-cors
import responseTime from 'koa-response-time';

// Middleware
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {log} from './utils/logging';

export function startServer() {
// path for the API-endpoint, ie /v0/, /v1/, or ..
  const apiPath = '/v' + parseInt(version, 10) + '/';   // eslint-disable-line
  const app = koa();
  const Router = router();
  const PORT = process.env.PORT || 3010; // eslint-disable-line no-process-env

  app.use(responseTime()); // This middleware should be placed as the very first to ensure that responsetime is correctly calculated

  // Use CORS
  const corsOptions = {
    origin: '*',
    methods: 'GET POST OPTIONS',
    headers: 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  };
  app.use(cors(corsOptions));

  // trust ip-addresses from X-Forwarded-By header, and log requests
  app.proxy = true;

  app.use(LoggerMiddleware());

  app.use(serve('./static'));

  Router.get('/', function *(next) {
    this.body = 'Hejmdal!';
    yield next;
  });

  Router.get('/status', function *(next) {
    this.body = 'OK!';
    yield next;
  });

  app.use(Router.routes());

  app.on('error', function (err, ctx) {
    log.error('Server error', {error: err, ctx: ctx});
  });

  app.listen(PORT, () => {
    log.debug(`Server is up and running on port ${PORT}!`);
  });
}
