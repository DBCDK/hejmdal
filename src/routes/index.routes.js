import combineRouters from 'koa-combine-routers';

// Routes
import rootRoutes from './root.routes';
import loginRoutes from './login.routes';
import logoutRoutes from './logout.routes';

const router = combineRouters([
  rootRoutes,
  loginRoutes,
  logoutRoutes
]);

export default router;

