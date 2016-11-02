import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';

import {getAttributes} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/Identityprovider/identityprovider.component';
import {setDefaultState} from '../middlewares/state.middleware';
import {redirectToClient} from '../middlewares/redirecttoclient.middleware';
import {storeTicket} from '../components/Ticket/ticket.component';
import mapAttributesToTicket from '../utils/attribute.mapper.util';
import * as Consent from '../components/Consent/consent.component';
import * as Culr from '../components/Culr/culr.component';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', setDefaultState, getAttributes, authenticate, Consent.retrieveUserConsent, mapAttributesToTicket, storeTicket, redirectToClient);
router.get('/identityProviderCallback/:type/:token', identityProviderCallback, Consent.retrieveUserConsent, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket, redirectToClient);
router.post('/identityProviderCallback/:type/:token', identityProviderCallback, Consent.retrieveUserConsent, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket, redirectToClient);
router.get('/consent', Consent.giveConsentUI);
router.post('/consentsubmit', Consent.consentSubmit, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket, redirectToClient);

export default router;
