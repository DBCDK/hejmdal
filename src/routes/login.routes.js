import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {setDefaultState} from '../middlewares/state.middleware';
import {getAttributes} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {storeTicket} from '../components/ticket.component';
import mapAttributesToTicket from '../components/attribute.mapper.component';
import * as Consent from '../components/Consent/consent.component';
import * as Culr from '../components/Culr/culr.component';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

router.get('/', setDefaultState, getAttributes, authenticate, Consent.retrieveUserConsent, mapAttributesToTicket, storeTicket);
router.get('/identityProviderCallback/:type/:token', identityProviderCallback, Consent.retrieveUserConsent, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket);
router.post('/identityProviderCallback/:type/:token', identityProviderCallback, Consent.retrieveUserConsent, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket);
router.get('/consent', Consent.giveConsentUI);
router.post('/consentsubmit', Consent.consentSubmit, Culr.getCulrAttributes, mapAttributesToTicket, storeTicket);

export default router;
