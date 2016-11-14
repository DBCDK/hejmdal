/* eslint-disable */
import {assert} from 'chai';

describe('Testing the Example appliction using UNI-Login', function() {
  this.timeout(30000);

  after(() => {
    browser.url('/wipestores');
  });

  it('should display ticket data in example application', () => {
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl = browser.getUrl();

    assert.isTrue(examplePageUrl.includes('/example/'));

    // Click login button on axample page
    browser.click('#login-button');
    // Click UNI-Login on IdentityProvider select page
    browser.click('*=UNI');
    // Click on accept consent button
    browser.click('#consent-actions-accept');

    // Assert that additional information containing a ticket-token and -id is shoen
    assert.isTrue(browser.isVisible('#post-success'));

    // assert
    const ticketToken = browser.getText('#tickettoken');
    assert.isOk(ticketToken);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    const getTicketLink = browser.getText('#ticketurl');
    assert.isTrue(getTicketLink.includes(`/getTicket/${ticketToken}/${ticketId}`));

    browser.click('#get-ticket-button');

    const ticket = JSON.parse(browser.getText('#ticket'));
    const expected = JSON.stringify({
      "attributes": {
        "cpr": null,
        "birthDate": null,
        "birthYear": null,
        "gender": null,
        "libraries": [],
        "municipality": null,
        "uniloginId": "test1234"
      },
      "id": 1,
      "token": "5fc9b591842fed38c6d1549ce85ee51280e353a56c9a2fb3c40e3a1e2011006a"
    });

    assert.equal(JSON.stringify(ticket), expected);
    browser.click('#reset-to-default');
  });

  it('Should create new ticket if user is logged in alreay', () => {
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl = browser.getUrl();

    assert.isTrue(examplePageUrl.includes('/example/'));

    // Click login button on axample page
    browser.click('#login-button');

    // Click UNI-Login on IdentityProvider select page
    browser.click('*=UNI');

    const ticket = browser.getText('#tickettoken');
    assert.isOk(ticket);

    const ticketId = browser.getText('#ticketid');
    assert.isOk(ticketId);

    // Repeating the above steps as we're now logged in
    browser.url('/');
    browser.click('#example-page-login');

    const examplePageUrl2 = browser.getUrl();

    assert.isTrue(examplePageUrl2.includes('/example/'));

    // Click login button on axample page
    browser.click('#login-button');

    // at this point above we clicked the UNI-Login button but since we're now logged
    // in we should skip this step be sent straight back to our origin with a new
    // ticket and ticket id
    const ticket2 = browser.getText('#tickettoken');
    assert.isOk(ticket2);

    const ticketId2 = browser.getText('#ticketid');
    assert.isOk(ticketId2);

    assert.notEqual(ticket, ticket2);
    assert.isAbove(ticketId2, ticketId);
  });
});
