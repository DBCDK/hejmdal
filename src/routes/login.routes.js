import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {initState} from '../utils/state.util';
import {getAttributes} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {generateTicketData, storeTicket} from '../components/ticket.component';
import ctxdump from '../components/ctxdump.component.js';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', initState, getAttributes, authenticate, generateTicketData, storeTicket/* , ctxdump */);
router.get('/identityProviderCallback/:type/:token', initState, identityProviderCallback, generateTicketData, storeTicket, ctxdump);

export default router;
