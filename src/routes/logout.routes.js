/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {VERSION_PREFIX} from '../utils/version.util';
import {logout} from '../components/Logout/logout.component';

const router = new Router({prefix: VERSION_PREFIX});

router.get('/logout', logout);

export default router;
