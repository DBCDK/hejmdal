/* eslint-disable */
import {assert} from 'chai';

describe('Testing the Example appliction', function() {
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
    browser.click('#login-buttons');
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
        "cpr": "5555666677",
        "birthDate": null,
        "birthYear": null,
        "gender": null,
        "libraries": [
          {
            "libraryid": "790900",
            "loanerid": "5555666677"
          },
          {
            "libraryid": "100800",
            "loanerid": "456456"
          }
        ],
        "municipality": "909"
      },
      "id": 1,
      "token": "dd79eabe560b5d980dff864ad7983b8fb9d3762b8546819c79188983b68ebe5f"
    });

    assert.equal(JSON.stringify(ticket), expected);
    browser.click('#reset-to-default');
  });
});
