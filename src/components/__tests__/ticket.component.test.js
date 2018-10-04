import {assert} from 'chai';
import sinon from 'sinon';
import {storeTicket, getTicket} from '../Ticket/ticket.component.js';
import {mockContext} from '../../utils/test.util';

describe('test store and get ticket', () => {
  const ctx = mockContext();
  ctx.locals = {
    oauth: {
      token: {
        user: '5555666677',
        client: 'hejmdal'
      }
    }
  };

  const next = () => {};

  it('should fetch the ticket', async () => {
    ctx.json = sinon.stub();
    await getTicket(ctx, ctx, next);
    assert.isTrue(ctx.json.called);
    assert.deepEqual(ctx.json.args[0][0], {
      agencies: [
        {
          agencyId: '790900',
          userId: '5555666677',
          userIdType: 'CPR'
        },
        {
          agencyId: '100800',
          userId: '456456',
          userIdType: 'LOCAL-1'
        }
      ],
      birthDate: null,
      birthYear: null,
      cpr: '5555666677',
      gender: null,
      municipality: '909',
      uniloginId: null,
      uniqueId:
        'faab41bd27774cc234b5a4c92410c1debf9ea28488f4bafec203b88fc88a1b28',
      userId: '5555666677',
      wayfId: null
    });
  });
});
