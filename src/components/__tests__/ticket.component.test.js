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

  const next = () => {};

  it('should return false for nonexisting ticket', () => {
    const ctx = {session: {state}};
    getTicket(ctx, next);
    assert.isFalse(ctx.session.state.ticket.attributes);
  });

  const attributes = {cpr: '123', library: '717171'};
  let params = {};

  it('should create a ticket-identifier and -token', () => {
    state.ticket.attributes = attributes;
    state.ticket.identifier = null;
    const ctx = {session: {state}};
    return storeTicket(ctx, next).then(() => {
      assert.isNumber(ctx.session.state.ticket.identifier);
      assert.isString(ctx.session.state.ticket.token);
      params = {
        token: ctx.session.state.ticket.token,
        id: ctx.session.state.ticket.identifier
      };
    });
  });

  it('should fetch the ticket', () => {
    const ctx = {
      session: {
        state: {},
      },
      params: params
    };

    return getTicket(ctx, next).then(() => {
      assert.isObject(ctx.session.state.ticket.attributes);
      assert.deepEqual(ctx.session.state.ticket.attributes, attributes);
    });
  });

  it('should only fetch ticket once', () => {
    const ctx = {
      session: {
        state: {},
      },
      params: params
    };
    return getTicket(ctx, next).then(() => {
      assert.isFalse(ctx.session.state.ticket.attributes);
    });
  });
});

