import {assert} from 'chai';
import {getWayfResponse} from '../wayf.component';
import {mockContext} from '../../../utils/test.util';

describe('Test wayf component', () => {
  const ctx = mockContext();

  it('Lookup a known user', async() => {
    const expected = {
      userId: '0102030405',
      wayfId: 'WAYF-DK-some-long-md5-like-string'
    };
    assert.deepEqual(await getWayfResponse(ctx), expected);
  });

});
