import combineRouters from 'koa-combine-routers';

// Routes
import rootRoutes from './root.routes';
import loginRoutes from './login.routes';
import getTicketRoutes from './getTicket.routes';
import logoutRoutes from './logout.routes';
import errorRoutes from './error.routes';

const router = combineRouters([
  rootRoutes,
  loginRoutes,
  getTicketRoutes,
  logoutRoutes,
  errorRoutes
]);

export default router;

