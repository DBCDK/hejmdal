import Router from 'koa-router';
import compose from 'koa-compose';
import {VERSION_PREFIX} from '../utils/version.util';
import {setDefaultState} from '../middlewares/state.middleware';
import {getAttributes} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/identityprovider/identityprovider.component';
import {storeTicket} from '../components/ticket.component';
import mapAttributesToTicket from '../components/attribute.mapper.component';
import * as Consent from '../components/Consent/consent.component';
import * as Culr from '../components/Culr/culr.component';

const router = new Router({prefix: VERSION_PREFIX + '/login'});

const identityProviderCallbackRoute = async (ctx, next) => {
  await compose([identityProviderCallback, Consent.retrieveUserConsent, culrTicketRoute])(ctx, next);
};
const culrTicketRoute = async (ctx, next) => {
  await compose([Culr.getCulrAttributes, mapAttributesToTicket, storeTicket])(ctx, next);
};

router.get('/', setDefaultState, getAttributes, authenticate, Consent.retrieveUserConsent, culrTicketRoute);
router.get('/identityProviderCallback/:type/:token', identityProviderCallbackRoute);
router.post('/identityProviderCallback/:type/:token', identityProviderCallbackRoute);
router.get('/consent', Consent.giveConsentUI);
router.post('/consentsubmit', Consent.consentSubmit, culrTicketRoute);

export default router;
