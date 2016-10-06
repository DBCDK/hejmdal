import {assert} from 'chai';

import {storeTicket, getTicket} from '../ticket.component.js';

describe('test store and get ticket', () => {
  const state = {
    ticket: {
      attributes: null,
      identifier: 'foo',
      token: 'bar'
    }
  };
  const next = () => {
  };
  it('should return false for nonexisting ticket', () => {
    const ctx = {state};
    getTicket(ctx, next);
    assert.isFalse(ctx.state.ticket.attributes);
  });

  const attributes = {cpr: '123', library: '717171'};
  it('should create a ticket-identifier and -token', () => {
    state.ticket.attributes = attributes;
    state.ticket.identifier = null;
    const ctx = {state};
    storeTicket(ctx, next);
    assert.isNumber(ctx.state.ticket.identifier);
    assert.isString(ctx.state.ticket.token);
  });

  it('should fetch the ticket', () => {
    state.ticket.attributes = null;
    const ctx = {state};
    getTicket(ctx, next);
    assert.isObject(ctx.state.ticket.attributes);
    assert.deepEqual(ctx.state.ticket.attributes, attributes);
  });

  it('should only fetch ticket once', () => {
    state.ticket.attributes = null;
    const ctx = {state};
    getTicket(ctx, next);
    assert.isFalse(ctx.state.ticket.attributes);
  });
});

