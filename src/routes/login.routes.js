import Router from 'koa-router';
import {initialize, authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {VERSION_PREFIX} from '../utils/version.util';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', initialize, authenticate);
router.get('/identityProviderCallback/:type/:token', initialize, identityProviderCallback);

export default router;
