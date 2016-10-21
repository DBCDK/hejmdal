/**
 * @file
 * Unittesting methods in consent.component.test
 */

import {assert} from 'chai';
import {giveConsentUI, consentSubmit, retrieveUserConsent, checkForExistingConsent, storeUserConsent} from '../consent.component';
import sinon from 'sinon';

import consentTemplate from '../templates/consent.template';
import {initState} from '../../../utils/state.util';
import {VERSION_PREFIX} from '../../../utils/version.util';
import {mockContext} from '../../../utils/test.util';

describe('Unittesting methods in consent.component.test', () => {
  let ctx;
  const next = () => {};
  let sandbox;

  beforeEach(() => {
    ctx = mockContext();
    initState(ctx, next);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should redirect if state is unavailable on ctx.session object', () => {
    ctx.redirect = sandbox.stub();

    giveConsentUI(ctx, next);
    assert.isTrue(ctx.redirect.called);
    assert.equal(ctx.redirect.args[0][0], `${VERSION_PREFIX}/fejl`);
  });

  it('should render html to ctx.body and call next', () => {
    ctx.redirect = sandbox.stub();
    ctx.session.state.serviceClient.id = 'testing...';
    const nextSpy = sandbox.stub();

    giveConsentUI(ctx, nextSpy);
    assert.equal(ctx.body, consentTemplate({service: ctx.session.state.serviceClient.id}));
    assert.isTrue(nextSpy.called);
  });

  it('should display consent rejected information', async() => {
    ctx.req = {headers: {

    }};
    const nextSpy = sandbox.stub();

    await consentSubmit(ctx, nextSpy);
    assert.equal(ctx.body, 'Consent rejected. What to do...?');
    assert.isTrue(nextSpy.called);
  });

  it('should redirect to /login/consent', async() => {
    ctx.redirect = sandbox.stub();

    await retrieveUserConsent(ctx, next);
    assert.isTrue(ctx.redirect.called);
    assert.equal(ctx.redirect.args[0][0], `${VERSION_PREFIX}/login/consent`);
  });

  it('should return false', async() => {
    const consent = await checkForExistingConsent(ctx);
    assert.isFalse(consent);
  });

  it('should return null', async() => {
    ctx.session.user = null;
    const consent = await checkForExistingConsent(ctx);
    assert.isNull(consent);
  });

  it('should retrieve consent form memory storage', async() => {
    const serviceClientId = Date.now();
    ctx.session.state.serviceClient.id = serviceClientId;

    await storeUserConsent(ctx);

    const consent = await checkForExistingConsent(ctx);
    assert.isObject(consent);
    assert.isObject(ctx.session.state.consents[serviceClientId]);
  });
});
