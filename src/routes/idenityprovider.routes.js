import Router from 'koa-router';
import compose from 'koa-compose';
import {initialize, authenticate, callback}  from '../components/identityprovider/identityprovider';
const router = new Router({ prefix: '/login' });

router.get('/', initialize, authenticate);
router.get('/callback/:type/:token',initialize, callback);

export default router;
