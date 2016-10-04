import Router from 'koa-router';
import {initialize, authenticate, callback}  from '../components/identityprovider/identityprovider.component';
const router = new Router({ prefix: '/login' });

router.get('/', initialize, authenticate);
router.get('/callback/:type/:token',initialize, callback);

export default router;
