import combineRouters from 'koa-combine-routers';

// Routes
import rootRoutes from './root.routes';
import loginRoutes from './login.routes';

const router = combineRouters([
  rootRoutes,
  loginRoutes
]);

export default router;

