/**
 * @file
 * Unittesting methods in culr.component
 */

import {getUserAttributesFromCulr} from '../culr.component';

describe('Unittesting methods in culr.component:', () => {
  describe('getCulrAttributes', () => {
    it('should return no attributes when no userId is given', async () => {
      const attributes = await getUserAttributesFromCulr();

      expect(attributes).toEqual({});
    });

    it('should return culr attributes -- OK200', async () => {
      const attributes = await getUserAttributesFromCulr('5555666677');

      expect(attributes).toEqual({
        accounts: [
          {
            provider: '790900',
            userIdType: 'CPR',
            userIdValue: '5555666677'
          },
          {
            provider: '100800',
            userIdType: 'LOCAL-1',
            userIdValue: '456456'
          }
        ],
        municipalityNumber: '909',
        culrId: 'some-random-curl-id'
      });
    });

    it('should return empty object -- ACCOUNT_DOES_NOT_EXIST', async () => {
      const attributes = await getUserAttributesFromCulr('not_existing_user');
      expect(attributes).toEqual({});
    });
  });
});
