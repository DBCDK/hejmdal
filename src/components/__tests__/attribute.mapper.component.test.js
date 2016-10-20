import {assert} from 'chai';

import mapAttributesToTicket from '../attribute.mapper.component.js';
import {mockContext} from '../../utils/test.util';

describe('Attribute mapper unittest', () => {
  const next = () => {
  };

  const user = {};

  it('do nothing', () => {
    const ctx = mockContext();
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.user, user);
  });

  it('map some values', () => {
    const ctx = mockContext();
    ctx.setState({
      culr: {
        culr: {
          aaa: 'aaa', bbb: 'bbb', ccc: 'ccc'
        }
      }, serviceClient: {
        attributes: ['aaa', 'bbb']
      },
      ticket: {}
    });
    mapAttributesToTicket(ctx, next);
    assert.deepEqual(ctx.session.state.ticket.attributes, {aaa: 'aaa', bbb: 'bbb'})
  });
});
