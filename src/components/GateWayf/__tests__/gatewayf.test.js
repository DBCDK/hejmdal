import {assert} from 'chai';
import {getGateWayfResponse} from '../gatewayf.component';
import {mockContext} from '../../../utils/test.util';

describe('Test GateWayf component', () => {
  const ctx = mockContext();

  it('Lookup a known user from nemlogin', async() => {
    const expected = {
      userId: '0102030405',
      wayfId: 'WAYF-DK-some-long-md5-like-string'
    };
    assert.deepEqual(await getGateWayfResponse(ctx, 'nemlogin'), expected);
  });

  it('Lookup a known user from wayf', async() => {
    const expected = {
      userId: '0102030405',
      wayfId: 'WAYF-DK-some-other-md5-like-string'
    };
    assert.deepEqual(await getGateWayfResponse(ctx, 'wayf'), expected);
  });

});
