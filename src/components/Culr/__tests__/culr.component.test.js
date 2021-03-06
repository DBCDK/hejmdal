/**
 * @file
 * Unittesting methods in culr.component
 */

import {
  shouldCreateAccount,
  getUserAttributesFromCulr,
  getMunicipalityInformation,
  sortAgencies,
  filterAgencies
} from '../culr.component';

describe('Unittesting methods in culr.component:', () => {
  describe('getCulrAttributes', () => {
    it('should return no attributes when no userId is given', async () => {
      const attributes = await getUserAttributesFromCulr();

      expect(attributes).toEqual({});
    });

    it('should return culr attributes -- OK200', async () => {
      const attributes = await getUserAttributesFromCulr({
        userId: '0102031111',
        agency: '790900'
      });

      expect(attributes).toEqual({
        accounts: [
          {
            provider: '790900',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          },
          {
            provider: '100800',
            userIdType: 'LOCAL-1',
            userIdValue: '456456'
          }
        ],
        municipalityNumber: '909',
        municipalityAgencyId: '790900',
        culrId: 'guid-0102031111'
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
          userId: '0102031111',
          agency: '790900',
          pincode: '1111'
        }
      );

      expect(result).toEqual({
        municipalityAgencyId: '790900',
        municipalityNumber: '909'
      });
    });

    it('should NOT generate municipalityAgencyId from municipalityNo if agency does NOT start with 7', async () => {
      const result = await getMunicipalityInformation(
        {MunicipalityNo: '123'},
        {
          userId: '0102031111',
          agency: '911130',
          pincode: '1111'
        }
      );
      expect(result).toEqual({
        municipalityAgencyId: '911130',
        municipalityNumber: '123'
      });
    });

    it('should return municipalityAgencyId even without MunicipalityNo', async () => {
      const result = await getMunicipalityInformation(
        {},
        {
          userId: '0102031111',
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
          userId: '0102031111',
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
          userId: '0102031111'
        }
      );
      expect(result).toEqual({});
    });
  });
  describe('shouldCreateAccount', () => {
    const ACCOUNT_DOES_NOT_EXIST = {
      result: {responseStatus: {responseCode: 'ACCOUNT_DOES_NOT_EXIST'}}
    };
    const ACCOUNT_EXISTS = {
      result: {
        Account: [{provider: '710100'}],
        responseStatus: {responseCode: 'OK200'}
      }
    };
    const BORCHK_USER = {identityProviders: ['borchk']};
    const NEMID_USER = {identityProviders: ['nemlogin']};
    it('should return false if library is not on municipalityName list', async () => {
      const result = await shouldCreateAccount('999999');
      expect(result).toEqual(false);
    });
    it('should return true if library is not on municipalityName list and using borchk', async () => {
      const result = await shouldCreateAccount(
        '710100',
        BORCHK_USER,
        ACCOUNT_DOES_NOT_EXIST
      );
      expect(result).toEqual(true);
    });
    it('should return false if NOT using borchk', async () => {
      const result = await shouldCreateAccount(
        '710100',
        NEMID_USER,
        ACCOUNT_DOES_NOT_EXIST
      );
      expect(result).toEqual(false);
    });
    it('should return false if account exists', async () => {
      const result = await shouldCreateAccount(
        '710100',
        BORCHK_USER,
        ACCOUNT_EXISTS
      );
      expect(result).toEqual(false);
    });
    it('should return true if account does not exists', async () => {
      const result = await shouldCreateAccount(
        '911130',
        BORCHK_USER,
        ACCOUNT_EXISTS
      );
      expect(result).toEqual(true);
    });
    describe('sortAgencies', () => {
      it('should prefer agency created with CPR', async () => {
        const MunicipalityNo = '329';
        const Account = [
          {
            provider: '732900',
            userIdType: 'LOCAL',
            userIdValue: '0102031111'
          },
          {
            provider: '732900',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          },
          {
            provider: '737000',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          }
        ];

        const result = sortAgencies(Account, MunicipalityNo);

        expect(result[0]).toEqual({
          provider: '732900',
          userIdType: 'CPR',
          userIdValue: '0102031111'
        });
      });

      it('should prefer provider matching MunicipalityNo above CPR', async () => {
        const MunicipalityNo = '329';
        const Account = [
          {
            provider: '737000',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          },
          {
            provider: '732900',
            userIdType: 'LOCAL',
            userIdValue: '0102031111'
          },
          {
            provider: '737000',
            userIdType: 'LOCAL',
            userIdValue: '0102031111'
          }
        ];

        const result = sortAgencies(Account, MunicipalityNo);

        expect(result[0]).toEqual({
          provider: '732900',
          userIdType: 'LOCAL',
          userIdValue: '0102031111'
        });
      });

      it('should remove agencies listed in blacklist', async () => {
        const Account = [
          {
            provider: '737000',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          },
          {
            provider: '732900',
            userIdType: 'LOCAL',
            userIdValue: '0102031111'
          },
          {
            provider: '190110',
            userIdType: 'LOCAL',
            userIdValue: 'some-value'
          }
        ];

        const result = filterAgencies(Account);

        expect(result).toEqual([
          {
            provider: '737000',
            userIdType: 'CPR',
            userIdValue: '0102031111'
          },
          {
            provider: '732900',
            userIdType: 'LOCAL',
            userIdValue: '0102031111'
          }
        ]);
      });
    });
  });
});
