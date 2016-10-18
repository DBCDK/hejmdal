import {assert} from 'chai';

import {storeTicket, getTicket} from '../ticket.component.js';

describe('test store and get ticket', () => {
  const ticket = {
    attributes: null,
    identifier: 'foo',
    token: 'bar'
  };

  const next = () => {
  };

  it('should return false for nonexisting ticket', () => {
    const ctx = { ticket: ticket };
    getTicket(ctx, next);
    assert.isFalse(ctx.ticket.attributes);
  });

  const attributes = {someId: '123', SomeInfo: '717171'};
  let params = {};

  it('should create a ticket-identifier and -token', () => {
    ticket.attributes = attributes;
    ticket.identifier = null;
    const ctx = { ticket: ticket };
    return storeTicket(ctx, next).then(() => {
      assert.isNumber(ctx.ticket.identifier);
      assert.isString(ctx.ticket.token);
      params = {
        token: ctx.ticket.token,
        id: ctx.ticket.identifier
      };
    });
  });

  it('should fetch the ticket', () => {
    const ctx = {
      ticket: null,
      params: params
    };

    return getTicket(ctx, next).then(() => {
      assert.isObject(ctx.ticket.attributes);
      assert.deepEqual(ctx.ticket.attributes, attributes);
    });
  });

  it('should only fetch ticket once', () => {
    const ctx = {
      session: {
        state: {}
      },
      params: params
    };
    return getTicket(ctx, next).then(() => {
      assert.isFalse(ctx.ticket.attributes);
    });
  });
});

