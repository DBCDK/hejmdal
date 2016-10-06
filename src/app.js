/**
 * @file
 * Configure and start our server
 */

// Libraries
import Koa from 'koa';
import serve from 'koa-static';
import router from './routes/index.routes';
import cors from 'koa-cors'; // @see https://github.com/evert0n/koa-cors
import convert from 'koa-convert';
import responseTime from 'koa-response-time';
import session from 'koa-session2';

// Middleware
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {SetVersionHeader} from './middlewares/headers.middleware';
import {SessionMiddleware} from './middlewares/session.middleware';

// Utils
import {log} from './utils/logging.util';
import {getSessionLifeTime} from './utils/session.util';

// Components
import SessionStore from './components/SessionStore/SessionStore.component';

export function startServer() {
  const app = new Koa();
  const PORT = process.env.PORT || 3010;

  app.use(session({
    store: new SessionStore(),
    key: 'sid',
    maxAge: getSessionLifeTime(),
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true
  }));

  app.use(SessionMiddleware);

  app.use(responseTime()); // This middleware should be placed as the very first to ensure that responsetime is correctly calculated
  app.use(LoggerMiddleware);
  app.use(SetVersionHeader);

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
    log.debug(`Server is up and running on port ${PORT}!`, {sessionLifetime: getSessionLifeTime()});
  });
}
