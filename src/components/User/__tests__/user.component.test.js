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
      attributes: {
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
        municipalityAgencyId: '790900',
        netpunktAgency: null,
        uniloginId: null,
        uniqueId: 'guid-5555666677',
        uniLoginInstitutions: [],
        userId: '5555666677',
        wayfId: null
      }
    });
  });
});
