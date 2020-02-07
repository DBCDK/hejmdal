import {getGateWayfLoginResponse} from '../gatewayf.component';
import {mockContext} from '../../../utils/test.util';

describe('Test GateWayf component', () => {
  const ctx = mockContext();

  it('Lookup a known user from nemlogin', async () => {
    const expected = {
      userId: '5555666677',
      wayfId: 'WAYF-DK-some-long-md5-like-string'
    };
    expect(await getGateWayfLoginResponse(ctx, 'nemlogin')).toEqual(expected);
  });

  it('Lookup a known user from wayf', async () => {
    const expected = {
      userId: '0102030405',
      wayfId: 'WAYF-DK-some-other-md5-like-string'
    };
    expect(await getGateWayfLoginResponse(ctx, 'wayf')).toEqual(expected);
  });
});
