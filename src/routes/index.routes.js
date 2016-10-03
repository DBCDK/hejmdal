import combineRouters from 'koa-combine-routers';

// Routes
import rootRoutes from './root.routes';
import ipRoutes from './idenityprovider.routes';

const router = combineRouters([
  rootRoutes,
  ipRoutes
]);

export default router;

