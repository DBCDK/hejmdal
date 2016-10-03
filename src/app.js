/**
 * @file
 * Configure and start our server
 */

// Config
import {version} from '../package.json';

// Libraries
import Koa from 'koa';
import serve from 'koa-static';
import router from './routes/index.routes';
import cors from 'koa-cors'; // @see https://github.com/evert0n/koa-cors
import convert from 'koa-convert';
import responseTime from 'koa-response-time';

// Middleware
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {log} from './utils/logging';

export function startServer() {
  const app = new Koa();
  const PORT = process.env.PORT || 3010; // eslint-disable-line no-process-env

  // path for the API-endpoint, ie /v0/, /v1/, or ..
  const apiPath = '/v' + parseInt(version, 10) + '/';   // eslint-disable-line

  app.use(responseTime()); // This middleware should be placed as the very first to ensure that responsetime is correctly calculated
  app.use(LoggerMiddleware);

  // Use CORS
  const corsOptions = {
    origin: '*',
    methods: 'GET POST OPTIONS',
    headers: 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  };
  app.use(convert(cors(corsOptions)));

  // trust ip-addresses from X-Forwarded-By header, and log requests
  app.proxy = true;

  app.use(convert(serve('./static')));

  app.use(router);

  app.on('error', function (err, ctx) {
    log.error('Server error', {error: err, ctx: ctx});
  });

  app.listen(PORT, () => {
    log.debug(`Server is up and running on port ${PORT}!`);
  });
}
