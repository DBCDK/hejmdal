/**
 * @file
 * Unittesting methods in consent.component.test
 */

import {assert} from 'chai';
import {
  giveConsentUI,
  retrieveUserConsent,
  getConsent,
  storeUserConsent
} from '../consent.component';
import sinon from 'sinon';

import {initState} from '../../../utils/state.util';
import {VERSION_PREFIX} from '../../../utils/version.util';
import {mockContext} from '../../../utils/test.util';
import {ATTRIBUTES} from '../../../utils/attributes.util';

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

  describe('giveConsentUI()', () => {

    it('should redirect if state is unavailable on ctx.session object', () => {
      ctx.redirect = sandbox.stub();

      giveConsentUI(ctx, next);
      assert.isTrue(ctx.redirect.called);
      assert.equal(ctx.redirect.args[0][0], `${VERSION_PREFIX}/fejl`);
    });
  });


  describe('retrieveUserConsent()', () => {

    it('should call next when no user or serviceClient.id is found', async() => {
      const _next = sandbox.stub();

      await retrieveUserConsent(ctx, _next);
      assert.isTrue(_next.called);
    });

    it('should redirect when no consent is found', async() => {
      ctx.redirect = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = 'testuser';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          id: serviceClientId,
          attributes: {
            cpr: {}
          }
        },
        ticket: {
          attributes: {
            cpr: '1234'
          }
        }

      });

      await retrieveUserConsent(ctx, next);
      assert.isTrue(ctx.redirect.called);
    });

    it('should invoke next when consent is found', async() => {
      ctx.redirect = sandbox.stub();
      const _next = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = 'testuser';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          id: serviceClientId
        }
      });

      await storeUserConsent(ctx);
      await retrieveUserConsent(ctx, _next);

      assert.isFalse(ctx.redirect.called);
      assert.isTrue(_next.called);
    });

    it('should delete old consent and redirect user to consent page', async() => {
      ctx.redirect = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = 'testUser';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          id: serviceClientId,
          attributes: ATTRIBUTES
        },
        ticket: {
          attributes: ATTRIBUTES
        }
      });

      // first we store the consent object and verify it has been stored
      await storeUserConsent(ctx);
      const consent = await getConsent(ctx);
      const consent_expected = ['cpr', 'birthDate', 'birthYear', 'gender', 'libraries', 'municipality', 'uniloginId', 'wayfId'];
      assert.deepEqual(consent, consent_expected, 'consent was stored as expected');

      // then we create sets a new attributes object and makes a request for the users consent.
      // The check between the old and the consent objekt is implicitly part of the retrival process.
      const newAttrbutes = Object.assign({}, ATTRIBUTES);
      delete newAttrbutes.cpr;
      ctx.setState({
        serviceClient: {
          id: serviceClientId,
          attributes: newAttrbutes
        }
      });

      await retrieveUserConsent(ctx, next);

      // ensuring the user is redirected to the consent page
      assert.isTrue(ctx.redirect.called);
      assert.equal(ctx.redirect.args[0], `${VERSION_PREFIX}/login/consent`);
    });
  });

  describe('checkForExistingConsent()', () => {

    it('should return false', async() => {
      const consent = await getConsent(ctx);

      assert.deepEqual(consent, []);
    });

    it('should retrieve consent form memory storage', async() => {
      const serviceClientId = Date.now();
      const userId = 'testuser';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          id: serviceClientId
        }
      });

      await storeUserConsent(ctx);

      const consent = await getConsent(ctx);

      assert.isArray(consent);
      assert.isObject(ctx.session.state.consents[serviceClientId]);
    });
  });
});
