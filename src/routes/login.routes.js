import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {initialize, authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {generateTicketData, storeTicket} from '../components/ticket.component';
import * as Consent from '../components/Consent/consent.component';
import ctxdump from '../components/ctxdump.component.js';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', initialize, authenticate, generateTicketData, storeTicket, ctxdump);
router.get('/identityProviderCallback/:type/:token', initialize, identityProviderCallback, Consent.retrieveUserConsent, generateTicketData, storeTicket, ctxdump);
router.get('/consent', Consent.giveConsentUI, /* generateTicketData, storeTicket, */ ctxdump);
router.post('/consentsubmit', Consent.consentSubmit, ctxdump);

export default router;
