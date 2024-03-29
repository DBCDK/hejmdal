import {getUser} from '../user.component.js';
import {mockContext} from '../../../utils/test.util.js';

describe('test store and get user', () => {
  const ctx = mockContext();
  ctx.locals = {
    oauth: {
      token: {
        user: {userId: '0102031111'},
        client: 'hejmdal'
      }
    }
  };

  const next = () => {};
  let notSet;

  it('should fetch the user', async () => {
    ctx.json = jest.fn();
    await getUser(ctx, ctx, next);
    expect(ctx.json).toBeCalledWith({
      attributes: {
        agencies: [
          {
            agencyId: '790900',
            userId: '0102031111',
            userIdType: 'CPR'
          },
          {
            agencyId: '100800',
            userId: '456456',
            userIdType: 'LOCAL-1'
          }
        ],
        agencyRights: [],
        municipalityAgencyRights: [],
        birthDate: '0102',
        birthYear: '1903',
        blocked: false,
        cpr: '0102031111',
        dbcidp: [
          {
            agencyId: notSet,
            rights: {}
          }
        ],
        dbcidpRoles: notSet,
        dbcidpUniqueId: notSet,
        dbcidpUserInfo: notSet,
        idpUsed: notSet,
        forsrights: [],
        gender: 'm',
        municipality: '909',
        municipalityAgencyId: '790900',
        netpunktAgency: null,
        serviceStatus: {borchk: 'ok', culr: 'ok'},
        uniloginId: null,
        uniqueId: 'guid-0102031111',
        uniLoginInstitutions: [],
        userId: '0102031111',
        userPrivilege: [],
        wayfId: null
      }
    });
  });
});
