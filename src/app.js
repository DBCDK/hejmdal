/**
 * @file
 * Configure and start oAuth2 hejmdal server
 */

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import session from 'express-session';
const KnexSessionStore = require('connect-session-knex')(session);

import model from './oAuth2/oAuth2.model';
import './oAuth2/authorize-handler';
import OAuthServer from 'express-oauth-server';
import initPassport from './oAuth2/passport';
import {setHeaders} from './middlewares/headers.middleware';
import {loggerMiddleware} from './middlewares/logger.middleware';
import errorMiddleware from './middlewares/error.middleware';
import {cacheAgencies} from './utils/agencies.util';

// Utils
import {CONFIG} from './utils/config.util';
import {log} from './utils/logging.util';

import {stateMiddleware} from './middlewares/state.middleware';
import loginRoutes from './routes/login.routes';
import logoutRoutes from './routes/logout.routes';
import rootRoutes from './routes/root.routes';
import oAuthRoutes from './routes/oauth.routes';
import casRoutes from './routes/cas.routes';
import userinfoRoutes from './routes/userinfo.routes';
import infoRoutes from './routes/info.routes';
import testRoutes from './routes/test.routes';
import initDatabase from './models/database';

const {knex} = initDatabase();
const app = express();
initPassport(app);
app.oauth = new OAuthServer({
  model, // See https://github.com/oauthjs/node-oauth2-server for specification
  allowBearerTokensInQueryString: true,
  grants: ['password', 'authorization_code'],
  debug: true,
  allowEmptyState: true,
  continueMiddleware: true
});

app.model = model;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/Templates'));

const corsOptions = {
  origin: '*',
  methods: 'GET POST OPTIONS',
  headers: 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
};
app.use(cors(corsOptions));
app.use(setHeaders);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  session({
    secret: CONFIG.session.secret,
    maxAge: CONFIG.session.life_time,
    saveUninitialized: true,
    secure: CONFIG.app.env === 'production',
    resave: true,
    unset: 'destroy',
    store: !CONFIG.mock_storage && new KnexSessionStore({knex})
  })
);

app.use(stateMiddleware);

app.use(express.static('static'));

app.use(loggerMiddleware);

app.use('/', rootRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/oauth', oAuthRoutes);
app.use('/cas', casRoutes);
app.use('/userinfo', userinfoRoutes);
app.use('/info', infoRoutes);
if (CONFIG.app.env === 'test') {
  app.use('/test', testRoutes);
}

app.use(errorMiddleware);

app.listen(process.env.PORT || 3000);

cacheAgencies(CONFIG.app.env === 'test' ? 'slagelse' : '');

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  log.error('unhandledRejection', {
    errorMessage: error.message,
    stack: error.stack
  });
});
