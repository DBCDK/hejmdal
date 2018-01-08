import Router from 'koa-router';
import compose from 'koa-compose';

import {getAttributes, getUserToken} from '../components/Smaug/smaug.component';
import {authenticate, identityProviderCallback} from '../components/Identityprovider/identityprovider.component';
import {setDefaultState} from '../middlewares/state.middleware';
import {redirectToClient} from '../middlewares/redirecttoclient.middleware';
import {storeTicket} from '../components/Ticket/ticket.component';
import mapAttributesToTicket from '../utils/attribute.mapper.util';
import {verifyToken} from '../components/VerifyToken/verifyToken.component';
import * as Consent from '../components/Consent/consent.component';
import * as Culr from '../components/Culr/culr.component';

const router = new Router({prefix: '/login'});

const identityProviderCallbackRoute = async(ctx, next) => {
  await compose([identityProviderCallback, collectAndCreateAttributesRoute, Consent.retrieveUserConsent, ticketRoute])(ctx, next);
};
const collectAndCreateAttributesRoute = async(ctx, next) => {
  await compose([Culr.getCulrAttributes, getUserToken, mapAttributesToTicket])(ctx, next);
};
const ticketRoute = async(ctx, next) => {
  await compose([storeTicket, redirectToClient])(ctx, next);
};

router.get('/', setDefaultState, getAttributes, authenticate, collectAndCreateAttributesRoute, Consent.retrieveUserConsent, ticketRoute);

router.get('/identityProviderCallback/:type/:token', identityProviderCallbackRoute);
router.get('/verifyToken', setDefaultState, verifyToken);

router.post('/identityProviderCallback/:type/:token', identityProviderCallbackRoute);
router.get('/consent', Consent.giveConsentUI);
router.get('/consentsubmit/:token', Consent.consentSubmit);
router.post('/consentsubmit/:token', Consent.consentSubmit, ticketRoute);

export default router;
