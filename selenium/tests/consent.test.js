/* eslint-disable no-undef */
/**
 * @file
 * Mainly testing the consent page. When the flow is finished a consent will be stored in memory on the testuser
 * (5555666677).
 * Therefore from this testsuite and onwards the give-/reject-consent page will be skipped.
 */
import {assert} from 'chai';

import LoginPage from '../pageObjects/loginPage';
import {VERSION_PREFIX} from '../../src/utils/version.util';

describe('Test Consent part of authetication flow', () => {
  let loginPage = null;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.loginWithUNIlogin();
  });

  afterEach(() => {
    browser.deleteCookie();
  });

  it('should send user to consent page', () => {
    // assert URL ends with 'login/consent'
    assert.isTrue(browser.getUrl().endsWith('login/consent'));
  });

  it('should render message to user', () => {
    const content = browser.getText('#content');
    const expected = 'Ved tryk på Acceptér, accepterer du at dele nedenståene informationer med';

    assert.isTrue(content.startsWith(expected));
  });

  it('should render attributenames in message shown to user', () => {
    const state = browser.getState();
    const attributes = state.serviceClient.attributes;

    Object.keys(attributes).forEach((key) => {
      const name = attributes[key].name;
      browser.include(name, '#consent-attributes');
    });
  });

  it('should render a form', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = `<form action="${VERSION_PREFIX}/login/consentsubmit" method="post">`;

    assert.isTrue(formHtml.includes(expected));
  });

  it('should render a form that contains a accept button', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = '<button id="consent-actions-accept" type="submit" value="1" name="userconsent">Acceptér</button>';

    assert.isTrue(formHtml.includes(expected));
  });

  it('should render a form that contains a reject button', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = '<button id="consent-actions-reject" type="submit" value="0" name="userconsent">Afvis</button>';

    assert.isTrue(formHtml.includes(expected));
  });

  it('should clear session and redirect user upon click on reject', () => {
    browser.click('#consent-actions-reject');

    const url = browser.getUrl();
    const expected = 'thumbsdown?message=consent%20was%20rejected';
    const session = browser.getSession();

    assert.isTrue(url.includes(expected));
    assert.isUndefined(session.state);
    assert.isUndefined(session.user);
  });

  it('should redirect to /consentsubmit and set session appropriately', () => {
    browser.click('#consent-actions-accept');

    const url = browser.getUrl();
    const expected = '/login/consentsubmit';

    const state = browser.getState();
    const serviceClientId = state.serviceClient.id;
    const consentKeys = state.consents[serviceClientId].keys;
    const expectedConsentKeys = Object.keys(state.serviceClient.attributes);

    browser.assertUniLoginUser();

    assert.isTrue(url.includes(expected));
    assert.sameMembers(consentKeys, expectedConsentKeys);

    assertTicket();
    assertCulr();
  });

  function assertTicket() {
    const state = browser.getState();
    const ticketAttributes = state.ticket.attributes;
    assert.deepEqual(ticketAttributes, {
      cpr: '5555666677',
      birthDate: null,
      birthYear: null,
      gender: null,
      libraries: [
        {libraryid: '790900', loanerid: '5555666677'},
        {libraryid: '100800', loanerid: '456456'}
      ],
      municipality: '909'
    });
  }

  function assertCulr() {
    const state = browser.getState();
    const culr = state.culr.accounts;
    assert.deepEqual(culr, [
      {
        provider: '790900',
        userIdType: 'CPR',
        userIdValue: '5555666677'
      },
      {
        provider: '100800',
        userIdType: 'LOCAL-1',
        userIdValue: '456456'
      }
    ]);
  }
});
