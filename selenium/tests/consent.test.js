/* eslint-disable */
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
    loginPage.login('unilogin');
  });

  afterEach(() => {
    browser.deleteCookie();
   browser.wipeStores();
    browser.url('/logout');
  });

  it('should send user to consent page', () => {
    // assert URL ends with 'login/consent'
    assert.isTrue(browser.getUrl().endsWith('login/consent'));
  });

  it('should render message to user', () => {
    const content = browser.getText('#content');
    const expected = 'beder om adgang til disse oplysninger';
    assert.isTrue(content.startsWith(expected));
  });

  it('should render attributenames in message shown to user', () => {
    const attributesRendered = browser.elements('#attribute');
    const formHtml = attributesRendered.getHTML().toString();
    const attributes = browser.getState().serviceClient.attributes;

    Object.keys(attributes).forEach((key) => {
      const name = attributes[key].name;
      switch (key) {
        case 'libraries':
        case 'uniloginId':
          assert.isTrue(formHtml.includes(name));
          break;
        default:
          assert.isFalse(formHtml.includes(name));
      }
    });
  });

  it('should render a form', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = `<form action="${VERSION_PREFIX}/login/consentsubmit/${loginPage.validToken}" method="post">`;

    assert.isTrue(formHtml.includes(expected));
  });

  it('should render a form that contains a accept button', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = '<button class="btn btn-success" id="consent-action-accept" type="submit" name="userconsent" value="1"><strong>GODKEND</strong></button>';

    assert.isTrue(formHtml.includes(expected));
  });

  it('should render a form that contains a reject button', () => {
    const consentActions = browser.elements('#consent-actions');
    const formHtml = consentActions.getHTML();
    const expected = `<a class="buffer-right-20 link-style" id="consent-action-reject" href="/v0/login/consentsubmit/${loginPage.validToken}"><strong>Godkend ikke</strong></a>`;

    assert.isTrue(formHtml.includes(expected));
  });

  it('should clear session and show a reject page including a return url', () => {
    browser.click('#consent-action-reject');

    const url = browser.getUrl();
    const expectedUrl = `login/consentsubmit/${loginPage.validToken}`;
    assert.isTrue(url.includes(expectedUrl));

    const session = browser.getSession();
    assert.isNull(session);

    const content = browser.getText('#content');
    const expected = 'har ikke fået adgang til de ønskede oplysninger';
    assert.isTrue(content.startsWith(expected));

    const returnText = browser.getText('#returnUrl');
    const expectedReturnText = 'Tilbage til';
    assert.isTrue(returnText.startsWith(expectedReturnText));

    const returnUrl = browser.elements('#returnUrl');
    const formHtml = returnUrl.getHTML();
    const expectedReturnUrl = 'message=consent%20was%20rejected';
    assert.isTrue(formHtml.includes(expectedReturnUrl));
  });

  it('should redirect to /example/', () => {
    browser.click('#consent-action-accept');
    browser.click('#get-ticket-button');

    const url = browser.getUrl();
    const expected = '/example/?token=';

    const ticket = browser.getTicketOnExamplePage();
    assert.isTrue(url.includes(expected));
    assertTicket();
  });

  function assertTicket() {
    const ticket = browser.getTicketOnExamplePage();
    const ticketAttributes = ticket.attributes;
    assert.deepEqual(ticketAttributes, {
      cpr: null,
      birthDate: null,
      birthYear: null,
      gender: null,
      libraries: [],
      municipality: null,
      uniloginId: 'test1234',
      wayfId: null
    });
  }
});
