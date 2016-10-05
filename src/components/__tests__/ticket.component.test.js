import {assert} from 'chai';

import {storeTicket, getTicket} from '../ticket.component.js';

describe('test store and get ticket', () => {
  it('should return false for nonexisting ticket', () => {
    const falseContent = getTicket('foo', 'bar');
    assert.isFalse(falseContent);
  });

  const serviceId = '654321';
  const attributes = {cpr: '123', library: '717171'};
  let ticket;
  it('should create a ticket', () => {
    ticket = storeTicket(serviceId, attributes);
    assert.isString(ticket.ticketIdentifier);
    assert.isString(ticket.ticketToken);
  });

  it('should fetch the ticket', () => {
    const ticketContent = getTicket(ticket.ticketIdentifier, ticket.ticketToken);
    assert.isObject(ticketContent);
    assert.deepEqual(ticketContent, attributes);
  });

  it('should only fetch ticket once', () => {
    const falseContent = getTicket(ticket.ticketIdentifier, ticket.ticketToken);
    assert.isFalse(falseContent);
  });
});

