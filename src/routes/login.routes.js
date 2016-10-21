import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {setDefaultState} from '../middlewares/state.middleware';
import {getAttributes} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {storeTicket} from '../components/ticket.component';
import mapAttributesToTicket from '../components/attribute.mapper.component';
import * as Consent from '../components/Consent/consent.component';
import * as Culr from '../components/Culr/culr.component';
import ctxdump from '../components/ctxdump.component.js';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', setDefaultState, getAttributes, authenticate, Consent.retrieveUserConsent, mapAttributesToTicket, storeTicket, ctxdump);
router.get('/identityProviderCallback/:type/:token', identityProviderCallback, Consent.retrieveUserConsent, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket, ctxdump);
router.get('/consent', Consent.giveConsentUI, ctxdump);
router.post('/consentsubmit', Consent.consentSubmit, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket, ctxdump);

export default router;
