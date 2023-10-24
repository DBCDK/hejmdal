/**
 * @file
 * Unittesting methods in culr.component
 */

import {
  shouldCreateAccount,
  getUserAttributesFromCulr,
  getUserInfoFromBorchk,
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
        blocked: false,
        municipalityNumber: '909',
        municipalityAgencyId: '790900',
        userPrivilege: [],
        culrId: 'guid-0102031111',
        errorBorchk: false,
        errorCulr: false
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
      const result = await getUserInfoFromBorchk(
        {MunicipalityNo: '1110'},
        {
          userId: '0102031111',
          agency: '911116',
          pincode: '1111'
        }
      );

      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: '911116',
        municipalityNumber: '1110',
        userPrivilege: []
      });
    });

    it('should keep non danish municipality without setting agency', async () => {
      const result = await getUserInfoFromBorchk(
        {MunicipalityNo: '5'},
        {
          userId: '0102031111',
          agency: '700400',
          pincode: '1111'
        }
      );

      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: null,
        municipalityNumber: '5',
        userPrivilege: []
      });
    });

    it('should keep non danish municipality and set agency from MUNICIPALITY_TO_AGENCY_TAB', async () => {
      const result = await getUserInfoFromBorchk(
        {MunicipalityNo: '4'},
        {
          userId: '0102031111',
          agency: '700401',
          pincode: '1111'
        }
      );

      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: '700400',
        municipalityNumber: '4',
        userPrivilege: []
      });
    });

    it('should set agency to 756100 from agency 563', async () => {
      const result = await getUserInfoFromBorchk(
        {MunicipalityNo: '563'},
        {
          userId: '0102031111',
          agency: '700400',
          pincode: '1111'
        }
      );

      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: '756100',
        municipalityNumber: '563',
        userPrivilege: []
      });
    });

    it('should NOT generate municipalityAgencyId from municipalityNo if agency does NOT start with 7', async () => {
      const result = await getUserInfoFromBorchk(
        {MunicipalityNo: '123'},
        {
          userId: '0102031111',
          agency: '911130',
          pincode: '1111'
        }
      );
      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: '911130',
        municipalityNumber: '123',
        userPrivilege: []
      });
    });

    it('should not return municipalityAgencyId or municipalityNumber', async () => {
      const result = await getUserInfoFromBorchk(
        {},
        {
          userId: '0102031111',
          pincode: '1234',
          agency: '710100'
        }
      );
      expect(result).toEqual({
        blocked: null,
        userPrivilege: []
      });
    });
    it('should return municipalityAgencyId and municipalityNumber', async () => {
      const result = await getUserInfoFromBorchk(
        {},
        {
          userId: '0102032222',
          pincode: '1234',
          agency: '790900'
        }
      );
      expect(result).toEqual({
        municipalityAgencyId: '790900',
        municipalityNumber: '909',
        blocked: null,
        userPrivilege: []
      });
    });
    it('should return municipalityAgencyId from non municipality libraries', async () => {
      const result = await getUserInfoFromBorchk(
        {},
        {
          userId: '0102031111',
          pincode: '1111',
          agency: '911116'
        }
      );
      expect(result).toEqual({
        blocked: null,
        municipalityAgencyId: '911116',
        userPrivilege: []
      });
    });
    it('should NOT return municipalityAgencyId if no user.agency', async () => {
      const result = await getUserInfoFromBorchk(
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
        Account: [{provider: '100400'}],
        responseStatus: {responseCode: 'OK200'}
      }
    };
    const BORCHK_USER = {userType: 'borchk', identityProviders: ['borchk']};
    const MITID_USER = {userType: 'nemlogin', identityProviders: ['nemlogin']};
    it('should return false if library is not on municipalityName list', async () => {
      const result = await shouldCreateAccount('999999');
      expect(result).toEqual(false);
    });
    it('should return true if library is not on municipalityName list and using borchk', async () => {
      const result = await shouldCreateAccount(
        '100400',
        BORCHK_USER,
        ACCOUNT_DOES_NOT_EXIST
      );
      expect(result).toEqual(true);
    });
    it('should return false if NOT using borchk', async () => {
      const result = await shouldCreateAccount(
        '100400',
        MITID_USER,
        ACCOUNT_DOES_NOT_EXIST
      );
      expect(result).toEqual(false);
    });
    it('should return false if account exists', async () => {
      const result = await shouldCreateAccount(
        '100400',
        BORCHK_USER,
        ACCOUNT_EXISTS
      );
      expect(result).toEqual(false);
    });
    it('should return true if account does not exists', async () => {
      const result = await shouldCreateAccount(
        '790900',
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
