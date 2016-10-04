import Router from 'koa-router';
import {initialize, authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';

const router = new Router({prefix: '/login'});

router.get('/', initialize, authenticate);
router.get('/identityProviderCallback/:type/:token', initialize, identityProviderCallback);

export default router;
