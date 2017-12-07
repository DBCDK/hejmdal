/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {logout} from '../components/Logout/logout.component';

const router = new Router({prefix: '/logout'});

router.get('/', logout);

export default router;
