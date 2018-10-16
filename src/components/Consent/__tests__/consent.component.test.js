/**
 * @file
 * Unittesting methods in consent.component.test
 */

import {assert} from 'chai';
import {
  giveConsentUI,
  retrieveMissingUserConsent,
  getConsent,
  storeUserConsent,
  findConsents,
  deleteConsents
} from '../consent.component';
import sinon from 'sinon';

import {setDefaultState} from '../../../middlewares/state.middleware';
import {mockContext} from '../../../utils/test.util';
import {ATTRIBUTES} from '../../../utils/attributes.util';

describe('Unittesting methods in consent.component.test', () => {
  let ctx;
  const next = () => {};
  let sandbox;

  beforeEach(() => {
    ctx = mockContext();
    setDefaultState(ctx, ctx, next);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('giveConsentUI()', () => {

    it('should redirect if state is unavailable on ctx.session object', () => {
      ctx.redirect = sandbox.stub();

      giveConsentUI(ctx, ctx, next);
      assert.isTrue(ctx.redirect.called);
      assert.equal(ctx.redirect.args[0][0], '/fejl');
    });
  });

  describe('retrieveMissingUserConsent()', () => {

    it('should call next when no user or serviceClient.id is found', async() => {
      const _next = sandbox.stub();

      await retrieveMissingUserConsent(ctx, ctx, _next);
      assert.isTrue(_next.called);
    });

    it('should redirect when no consent is found', async() => {
      ctx.redirect = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = '5555666677';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          requireConsent: true,
          clientId: serviceClientId,
          attributes: {
            cpr: {}
          }
        }
      });

      await retrieveMissingUserConsent(ctx, ctx, next);
      assert.isTrue(ctx.redirect.called);
    });

    it('should invoke next when consent is found', async() => {
      ctx.redirect = sandbox.stub();
      const _next = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = '5555666677';

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          clientId: serviceClientId,
          attributes: ATTRIBUTES
        },
        consentAttributes: ATTRIBUTES
      });

      await storeUserConsent(ctx);
      await retrieveMissingUserConsent(ctx, ctx, _next);

      assert.isFalse(ctx.redirect.called);
      assert.isTrue(_next.called);
    });

    it('should delete old consent and redirect user to consent page', async() => {
      ctx.redirect = sandbox.stub();
      const serviceClientId = Date.now();
      const userId = '5555666677';

      const ALT_ATTRIBUTES = Object.assign({}, ATTRIBUTES);
      delete ALT_ATTRIBUTES.cpr;

      ctx.setUser({userId: userId});
      ctx.setState({
        serviceClient: {
          clientId: serviceClientId,
          attributes: ALT_ATTRIBUTES
        },
        consentAttributes: ALT_ATTRIBUTES
      });

      // first we store the consent object and verify it has been stored
      await storeUserConsent(ctx);
      const consent = await getConsent(userId, serviceClientId);
      const consent_expected = ['birthDate', 'birthYear', 'gender', 'libraries', 'municipality', 'uniloginId', 'userId', 'wayfId', 'uniqueId', 'authenticatedToken'];
      assert.deepEqual(consent, consent_expected, 'consent was stored as expected');

      ctx.setState({
        serviceClient: {
          requireConsent: true,
          clientId: serviceClientId,
          attributes: ATTRIBUTES
        }
      });

      await retrieveMissingUserConsent(ctx, ctx, next);

      // ensuring the user is redirected to the consent page
      assert.isTrue(ctx.redirect.called);
      assert.equal(ctx.redirect.args[0], '/consent');
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
          clientId: serviceClientId
        }
      });

      await storeUserConsent(ctx);

      const consent = await getConsent(ctx);

      assert.isArray(consent);
    });
  });

  describe('findConsents()', () => {

    it('should return false', async() => {
      const consent = await findConsents(ctx);

      assert.deepEqual(consent, []);
    });

    it('should find consents for user in memory storage', async() => {

      ctx.setUser({userId: 'testuser1'});
      ctx.setState({
        consentAttributes: {},
        serviceClient: {
          clientId: 'some-client'
        }
      });
      await storeUserConsent(ctx);

      ctx.setUser({userId: 'testuser2'});
      ctx.setState({
        consentAttributes: {},
        serviceClient: {
          clientId: 'some-client'
        }
      });
      await storeUserConsent(ctx);
      ctx.setState({
        consentAttributes: {},
        serviceClient: {
          clientId: 'some-other-client'
        }
      });
      await storeUserConsent(ctx);

      const consents = await findConsents(ctx);
      assert.deepEqual(consents, [
        {
          consentId: '2bffdc16e6622922465819191b0f7919bf897329701bf55632bc728c4d5e6cc3:some-client',
          userId: '2bffdc16e6622922465819191b0f7919bf897329701bf55632bc728c4d5e6cc3',
          serviceClientId: 'some-client',
          consent: {
            keys: []
          }
        },
        {
          consentId: '2bffdc16e6622922465819191b0f7919bf897329701bf55632bc728c4d5e6cc3:some-other-client',
          userId: '2bffdc16e6622922465819191b0f7919bf897329701bf55632bc728c4d5e6cc3',
          serviceClientId: 'some-other-client',
          consent: {
            keys: []
          }
        }
      ]);
    });

    it('should not find consents for a prefix of a userId', async() => {

      ctx.setUser({userId: 'testuser1'});
      ctx.setState({
        consentAttributes: {a: 'a', b: 'b'},
        serviceClient: {
          id: 'some-client'
        }
      });
      await storeUserConsent(ctx);

      ctx.setUser({userId: 't'});
      const consents = await findConsents(ctx);

      assert.deepEqual(consents, []);
    });
  });


  describe('deleteConsents()', () => {

    it('should delete consents for user', async() => {

      ctx.setUser({userId: 'testuser1'});
      ctx.setState({
        consentAttributes: {a: 'a', b: 'b'},
        serviceClient: {
          clientId: 'some-client'
        }
      });
      await storeUserConsent(ctx);

      ctx.setUser({userId: 'testuser2'});
      ctx.setState({
        serviceClient: {
          clientId: 'some-client'
        }
      });
      await storeUserConsent(ctx);
      ctx.setState({
        serviceClient: {
          clientId: 'some-other-client'
        }
      });
      await storeUserConsent(ctx);
      assert.isTrue((await findConsents(ctx)).length > 0);
      await deleteConsents(ctx, ctx, next);
      assert.isTrue((await findConsents(ctx)).length === 0);
      ctx.setUser({userId: 'testuser1'});
      assert.isTrue((await findConsents(ctx)).length > 0);
    });
  });
});
