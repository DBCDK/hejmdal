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
  let params = {};
  it('should create a ticket-identifier and -token', () => {
    state.ticket.attributes = attributes;
    state.ticket.identifier = null;
    const ctx = {state};
    return storeTicket(ctx, next).then(() => {
      assert.isNumber(ctx.state.ticket.identifier);
      assert.isString(ctx.state.ticket.token);
      params = {
        token: ctx.state.ticket.token,
        id: ctx.state.ticket.identifier
      };
    });
  });

  it('should fetch the ticket', () => {
    const ctx = {
      state: {},
      params: params
    };
    return getTicket(ctx, next).then(() => {
      assert.isObject(ctx.state.ticket.attributes);
      assert.deepEqual(ctx.state.ticket.attributes, attributes);
    });
  });

  it('should only fetch ticket once', () => {
    const ctx = {
      state: {},
      params: params
    };
    return getTicket(ctx, next).then(() => {
      assert.isFalse(ctx.state.ticket.attributes);
    });
  });
});

