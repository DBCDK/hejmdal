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
import Pug from 'koa-pug';
import responseTime from 'koa-response-time';
import Knex from 'knex';
import {Model} from 'objection';
import sanityCheck from './utils/sanityCheck.util';

// Middleware
import {LoggerMiddleware} from './middlewares/logger.middleware';
import {SetHeaders} from './middlewares/headers.middleware';
import session from './middlewares/session.middleware';
import {stateMiddleware} from './middlewares/state.middleware';
import errorMiddleware from './middlewares/error.middleware';
import ctxdump from './middlewares/ctxdump.middleware';

// Utils
import {CONFIG, validateConfig} from './utils/config.util';
import {VERSION} from './utils/version.util';
import {log} from './utils/logging.util';
import {cacheAgencies} from './utils/agencies.util';

// Components
import SessionStore from './components/SessionStore/SessionStore.component';

export function startServer() {
  validateConfig();
  const app = new Koa();
  app.name = 'Adgangsplatformen';
  const PORT = CONFIG.app.port;

  // Initialize knex.
  const knex = Knex(CONFIG.postgres);

  // Add pug
  const pug = new Pug({
    viewPath: 'src/Templates',
    debug: true,
    compileDebug: true,
    noCache: CONFIG.app.env !== 'production',
    pretty: CONFIG.app.env !== 'production',
    locals: {
      version: VERSION
    }
  });

  pug.use(app);

  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  Model.knex(knex);

  // Check if connection to external resources is possible
  sanityCheck();

  app.use(session({
    store: new SessionStore(CONFIG.mock_storage),
    key: 'sid',
    maxAge: null,
    secure: CONFIG.app.env === 'production',
    path: '/',
    httpOnly: true
  }));

  app.use(convert(serve('./static', {
    maxage: CONFIG.app.env !== 'production' ? 0 : 2628000000 // one month
  })));

  app.use(stateMiddleware);
  app.use(responseTime()); // This middleware should be placed as the very first to ensure that responsetime is correctly calculated
  app.use(LoggerMiddleware);
  app.use(SetHeaders);

  // Use CORS
  const corsOptions = {
    origin: '*',
    methods: 'GET POST OPTIONS',
    headers: 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  };
  app.use(convert(cors(corsOptions)));

  // trust ip-addresses from X-Forwarded-By header, and log requests
  app.proxy = true;

  cacheAgencies(CONFIG.app.env === 'test' ? 'slagelse' : '');

  app.use(errorMiddleware);

  app.use(router);


  if (CONFIG.app.env !== 'production') {
    app.use(ctxdump);
  }

  app.on('error', (err) => {
    log.error('Server error', {error: err.message, stack: err.stack});
  });

  app.listen(PORT, () => {
    log.debug(`Server is up and running on port ${PORT}!`, {sessionLifetime: CONFIG.session.life_time});
  });
}
