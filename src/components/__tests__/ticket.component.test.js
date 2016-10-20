import {assert} from 'chai';

import {storeTicket, getTicket} from '../ticket.component.js';
import {mockContext} from '../../utils/test.util';

describe('test store and get ticket', () => {
  const ctx = mockContext();
  const ticket = {
    attributes: null,
    id: 'foo',
    token: 'bar'
  };

  const next = () => {
  };

  it('should return false for nonexisting ticket', () => {
    ctx.session.state.ticket = ticket;
    getTicket(ctx, next);
    assert.isFalse(ctx.session.state.ticket.attributes);
  });

  const attributes = {someId: '123', SomeInfo: '717171'};
  let params = {};

  it('should create a ticket-identifier and -token', () => {
    ticket.attributes = attributes;
    ticket.id = null;
    ctx.session.state.ticket = ticket;
    return storeTicket(ctx, next).then(() => {
      assert.isNumber(ctx.session.state.ticket.id);
      assert.isString(ctx.session.state.ticket.token);
      params = {
        token: ctx.session.state.ticket.token,
        id: ctx.session.state.ticket.id
      };
    });
  });

  it('should fetch the ticket', () => {
    ctx.session.state.ticket = {};
    ctx.params = params;

    return getTicket(ctx, next).then(() => {
      assert.isObject(ctx.session.state.ticket.attributes);
      assert.deepEqual(ctx.session.state.ticket.attributes, attributes);
    });
  });

  it('should only fetch ticket once', () => {
    ctx.session.state.ticket = {};
    ctx.params = params;
    return getTicket(ctx, next).then(() => {
      assert.isFalse(ctx.session.state.ticket.attributes);
    });
  });
});

