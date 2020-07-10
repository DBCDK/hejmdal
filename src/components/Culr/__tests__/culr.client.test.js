/**
 * @file
 * Unittesting methods in culr.component
 */

import {createAccount, init} from '../culr.client';

describe('Tests for CULR client. Assert that methods are called with correct params', () => {
  beforeAll(async () => {
    await init(false);
  });
  describe('createAccount', () => {
    it('should call createAccount with correct params', async () => {
      const res = await createAccount({
        userIdType: 'CPR',
        userIdValue: 'user',
        agencyId: '1234',
        municipalityNo: '101'
      });
      expect(res).toMatchSnapshot();
    });
    it('should call createAccount without municipalityNo', async () => {
      const res = await createAccount({
        userIdType: 'CPR',
        userIdValue: 'user',
        agencyId: '1234'
      });
      expect(res).toMatchSnapshot();
    });
  });
});
