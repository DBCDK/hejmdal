/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {logout} from '../components/Logout/logout.component';
import {setDefaultState} from '../middlewares/state.middleware';

const router = new Router({prefix: '/logout'});

router.get('/', setDefaultState, logout);

export default router;
