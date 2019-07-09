/**
 * @file
 * Unittesting methods in culr.component
 */

import {
  getUserAttributesFromCulr,
  getMunicipalityInformation
} from '../culr.component';

describe('Unittesting methods in culr.component:', () => {
  describe('getCulrAttributes', () => {
    it('should return no attributes when no userId is given', async () => {
      const attributes = await getUserAttributesFromCulr();

      expect(attributes).toEqual({});
    });

    it('should return culr attributes -- OK200', async () => {
      const attributes = await getUserAttributesFromCulr({
        userId: '5555666677',
        agency: '790900'
      });

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
        municipalityAgencyId: '790900',
        culrId: 'guid-5555666677'
      });
    });

    it('should return empty object -- ACCOUNT_DOES_NOT_EXIST', async () => {
      const attributes = await getUserAttributesFromCulr({
        userId: 'not_existing_user'
      });
      expect(attributes).toEqual({});
    });
  });
  describe('getMunicipalityInformation', () => {
    it('should NOT return municipalityNo from CULR if not length === 3', async () => {
      const result = await getMunicipalityInformation(
        {MunicipalityNo: '?'},
        {
          userId: '5555666677',
          agency: '790900',
          pincode: '1111'
        }
      );
      expect(result).toEqual({
        municipalityAgencyId: '790900',
        municipalityNumber: '909'
      });
    });
    it('should return municipalityAgencyId even without MunicipalityNo', async () => {
      const result = await getMunicipalityInformation(
        {},
        {
          userId: '5555666677',
          pincode: '1234',
          agency: '710100'
        }
      );
      expect(result).toEqual({
        municipalityAgencyId: '710100',
        municipalityNumber: '101'
      });
    });
    it('should return municipalityAgencyId from non municipality libraries', async () => {
      const result = await getMunicipalityInformation(
        {},
        {
          userId: '5555666677',
          pincode: '1111',
          agency: '911116'
        }
      );
      expect(result).toEqual({
        municipalityAgencyId: '911116'
      });
    });
    it('should NOT return municipalityAgencyId if no user.agency', async () => {
      const result = await getMunicipalityInformation(
        {},
        {
          userId: '5555666677'
        }
      );
      expect(result).toEqual({});
    });
  });
});
