import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {initialize, authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {generateTicketData, storeTicket, getTicket} from '../components/ticket.component';
import ctxdump from '../components/ctxdump.component.js';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', initialize, authenticate, generateTicketData, storeTicket/* , ctxdump */);
router.get('/identityProviderCallback/:type/:token', initialize, identityProviderCallback, generateTicketData, storeTicket, ctxdump);
router.get('/getTicket/:token/:id', initialize, authenticate, getTicket, ctxdump);

export default router;
