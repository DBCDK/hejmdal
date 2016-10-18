/**
 * @file
 * Unittesting methods in consent.component.test
 */

import {assert} from 'chai';
import {giveConsentUI, consentSubmit} from '../consent.component';
import sinon from 'sinon';

import consentTemplate from '../templates/consent.template';
import {VERSION_PREFIX} from '../../../utils/version.util';

describe('Unittesting methods in consent.component.test', () => {

  it('should redirect if state is unavailable on ctx.session object', () => {
    const ctx = {
      session: {},
      redirect: sinon.stub()
    };

    const next = () => {};

    giveConsentUI(ctx, next);
    assert.isTrue(ctx.redirect.called);
    assert.equal(ctx.redirect.args[0][0], `${VERSION_PREFIX}/fejl`);
  });

  it('should redirect if service is unavailable on ctx.session.state object', () => {
    const ctx = {
      session: {
        state: {}
      },
      redirect: sinon.stub()
    };

    const next = () => {};

    giveConsentUI(ctx, next);
    assert.isTrue(ctx.redirect.called);
    assert.equal(ctx.redirect.args[0][0], `${VERSION_PREFIX}/fejl`);
  });

  it('should render html to ctx.body and call next', () => {
    const ctx = {
      session: {
        state: {
          service: 'testing...'
        }
      }
    };

    const next = sinon.stub();

    giveConsentUI(ctx, next);
    assert.equal(ctx.body, consentTemplate({service: ctx.session.state.service}));
    assert.isTrue(next.called);
  });

  it('should display consent rejected information', async() => {
    const ctx = {
      req: {
        headers: {}
      }
    };

    const next = sinon.stub();

    await consentSubmit(ctx, next);
    assert.equal(ctx.body, 'Consent rejected. What to do...?');
    assert.isTrue(next.called);
  });
});
