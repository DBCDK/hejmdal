import combineRouters from 'koa-combine-routers';

// Routes
import rootRoutes from './root.routes';
import loginRoutes from './login.routes';
import getTicketRoutes from './getTicket.routes';
import infoRoutes from './info.routes';
import logoutRoutes from './logout.routes';

const router = combineRouters([
  rootRoutes,
  loginRoutes,
  getTicketRoutes,
  infoRoutes,
  logoutRoutes
]);

export default router;

