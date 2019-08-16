/**
 * @file
 * Unittesting methods in unilogin.component
 */

/* eslint-disable max-len */

import {
  getInstitutionIdsForUser,
  getInstitutionInformation
} from '../unilogin.client.js';
import './nockFixtures'; // Loads nock fixtures that mocks soap requests and responses

describe('Unittesting unilogin.client', () => {
  beforeEach(() => {});
  it('Should get institutions for user', async () => {
    const result = await getInstitutionIdsForUser('valid_user_id');
    expect(result).toEqual(['101DBC', 'A03132']);
  });
  it('Should not get institutions for user', async () => {
    const result = await getInstitutionIdsForUser('not_a_user');
    expect(result).toEqual([]);
  });

  it('Should get information about institution', async () => {
    const result = await getInstitutionInformation(['101DBC', 'A03132']);
    expect(result).toEqual([
      {id: '101DBC', name: 'DANSK BIBLIOTEKSCENTER A/S'},
      {id: 'A03132', name: 'Vejle Bibliotekerne c/o www.pallesgavebod.dk'}
    ]);
  });
});
