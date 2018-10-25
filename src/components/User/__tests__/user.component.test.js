import {getUser} from '../user.component.js';
import {mockContext} from '../../../utils/test.util.js';

describe('test store and get user', () => {
  const ctx = mockContext();
  ctx.locals = {
    oauth: {
      token: {
        user: {userId: '5555666677'},
        client: 'hejmdal'
      }
    }
  };

  const next = () => {};

  it('should fetch the user', async () => {
    ctx.json = jest.fn();
    await getUser(ctx, ctx, next);
    expect(ctx.json).toBeCalledWith({
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
