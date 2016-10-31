import {assert} from 'chai';
import {getWayfResponse} from '../wayf.component';
import {mockContext} from '../../../utils/test.util';

describe('Test wayf component', () => {
  const ctx = mockContext();

  it('Lookup a known user', async () => {
    assert.deepEqual(await getWayfResponse(ctx), {userId: '0102030405'});
  });

});
