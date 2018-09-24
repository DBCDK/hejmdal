import {assert} from 'chai';

import {storeTicket, getTicket} from '../Ticket/ticket.component.js';
import {mockContext} from '../../utils/test.util';

describe('test store and get ticket', () => {
  const ctx = mockContext();

  const next = () => {};

  it('should return false for nonexisting ticket', async () => {
    ctx.setState({ticket: {attributes: null, id: 'foo', token: 'bar'}});
    ctx.params = {};
    await getTicket(ctx, next);
    assert.isFalse(ctx.getState().ticket.attributes);
  });

  const attributes = {someId: '123', SomeInfo: '717171'};
  const params = {};

  it('should create a ticket-identifier and -token', () => {
    ctx.setState({ticket: {attributes: attributes, id: null}});
    return storeTicket(ctx, null, next).then(() => {
      assert.isNumber(ctx.getState().ticket.id);
      assert.isString(ctx.getState().ticket.token);
      params.token = ctx.getState().ticket.token;
      params.id = ctx.getState().ticket.id;
    });
  });

  it('should fetch the ticket', () => {
    ctx.setState({ticket: {}});
    ctx.params = params;

    return getTicket(ctx, next).then(() => {
      assert.isObject(ctx.getState().ticket.attributes);
      assert.deepEqual(ctx.getState().ticket.attributes, attributes);
    });
  });

  it('should only fetch ticket once', () => {
    ctx.setState({ticket: {}});
    ctx.params = params;
    return getTicket(ctx, next).then(() => {
      assert.isFalse(ctx.getState().ticket.attributes);
    });
  });
});
