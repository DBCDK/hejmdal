/**
 * @file
 * Unittesting methods in consent.component.test
 */

import {assert} from 'chai';
import {giveConsentUI, consentSubmit} from '../consent.component';
import sinon from 'sinon';

import consentTemplate from '../templates/consent.template';
import {initState} from '../../../utils/state.util';
import {VERSION_PREFIX} from '../../../utils/version.util';

describe('Unittesting methods in consent.component.test', () => {
  let ctx;
  const next = () => {};
  let sandbox;

  beforeEach(() => {
    ctx = {query: {}};
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
    ctx.session.state.serviceClient.name = 'testing...';
    const nextSpy = sandbox.stub();

    giveConsentUI(ctx, nextSpy);
    assert.equal(ctx.body, consentTemplate({service: ctx.session.state.serviceClient.name}));
    assert.isTrue(nextSpy.called);
  });

  it('should display consent rejected information', async() => {
    ctx.req = {headers: {}};
    const nextSpy = sandbox.stub();

    await consentSubmit(ctx, nextSpy);
    assert.equal(ctx.body, 'Consent rejected. What to do...?');
    assert.isTrue(nextSpy.called);
  });
});
