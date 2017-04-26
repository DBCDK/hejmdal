/* eslint-disable */
import {assert} from 'chai';
import Page from '../pageObjects/page';

describe('Testing the Example appliction using UNI-Login', function() {
  const page = new Page();

  after(() => {
   browser.wipeStores();
  });

  it('should display ticket data in example application', () => {
    page.open();
    browser.click('#example-page-login');

    const examplePageUrl = browser.getUrl();

    assert.isTrue(examplePageUrl.includes('/example/'));

    // Click login button on example page
    browser.setValue('#input-login-token', page.validToken);
    browser.click('#login-button');

    // Click UNI-Login on IdentityProvider select page
    browser.click('#unilogin-btn');
    // Click on accept consent button
    browser.click('#consent-action-accept');

    // Assert that additional information containing a ticket-token and -id is shown
    assert.isTrue(browser.isVisible('#post-success'));

    // assert
    const ticketToken = browser.getText('#tickettoken');
    assert.isOk(ticketToken);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    const getTicketLink = browser.getText('#ticketurl');
    assert.isTrue(getTicketLink.includes(`/getTicket/${ticketToken}/${ticketId}`));

    const ticket = page.getTicket();
    const expected = {
      "attributes": {
        "cpr": null,
        "userId": 'test1234',
        "birthDate": null,
        "birthYear": null,
        "gender": null,
        "agencies": [],
        "municipality": null,
        "uniloginId": "test1234",
        "wayfId": null,
      },
      "id": 1,
      "token": "5fc9b591842fed38c6d1549ce85ee51280e353a56c9a2fb3c40e3a1e2011006a"
    };

    assert.deepEqual(ticket, expected);
    browser.url('/');
    browser.click('#example-page-login');
    browser.click('#reset-to-default');
  });

  it('Should create new ticket if user is logged in alreay', () => {
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl = browser.getUrl();

    assert.isTrue(examplePageUrl.includes('/example/'));

    // Click login button on example page
    browser.setValue('#input-login-token', page.validToken);
    browser.click('#login-button');
    // Click UNI-Login on IdentityProvider select page
    browser.click('#unilogin-btn');

    const ticketToken = browser.getText('#tickettoken');
    assert.isOk(ticketToken);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    // Repeating the above steps as we're now logged in
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl2 = browser.getUrl();

    assert.isTrue(examplePageUrl2.includes('/example/'));

    // Click login button on example page
    browser.setValue('#input-login-token', page.validToken);
    browser.click('#login-button');

    // at this point above we clicked the UNI-Login button but since we're now logged
    // in we should skip this step be sent straight back to our origin with a new
    // ticket and ticket id
    const ticketToken2 = browser.getText('#tickettoken');
    assert.isOk(ticketToken2);

    const ticketId2 = browser.getText('#ticketid');
    assert.isOk(ticketId2);

    assert.notEqual(ticketToken, ticketToken2);
    assert.isAbove(ticketId2, ticketId);
  });
});
