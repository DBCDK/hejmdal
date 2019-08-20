/**
 * @file
 * Unittesting methods in unilogin.component
 */

import {
  validateUniloginTicket,
  getInstitutionsForUser
} from '../unilogin.component.js';
import {md5} from '../../../utils/hash.utils';
import {CONFIG} from '../../../utils/config.util';
import moment from 'moment';
import './nockFixtures'; // Loads nock fixtures that mocks soap requests and responses

describe('Unittesting methods in unilogin.component', () => {
  let ticket = {};

  beforeEach(() => {
    const user = 'valid_user_id';
    const timestamp = moment()
      .utc()
      .format('YYYYMMDDHHmmss');
    const auth = md5(timestamp + CONFIG.unilogin.secret + user);
    ticket = {
      auth: auth,
      timestamp: timestamp,
      user: user
    };
  });

  it('Should succesfully validate ticket', () => {
    const result = validateUniloginTicket(ticket);
    expect(result).toBe(true);
  });

  it('Should reject ticket because of age', () => {
    ticket.timestamp = '19700101010100';
    const result = validateUniloginTicket(ticket);
    expect(result).toBe(false);
  });

  it('Should reject ticket because of invalid auth', () => {
    ticket.auth = 'invalid-auth';
    const result = validateUniloginTicket(ticket);
    expect(result).toBe(false);
  });
  it('Should get institutions for userId', async () => {
    const result = await getInstitutionsForUser('valid_user_id');
    expect(result).toEqual([
      {id: '101DBC', name: 'DANSK BIBLIOTEKSCENTER A/S'},
      {id: 'A03132', name: 'Vejle Bibliotekerne c/o www.pallesgavebod.dk'}
    ]);
  });
  it('Should return empty array of  institutions for invalid user id', async () => {
    const result = await getInstitutionsForUser('not_a_user');
    expect(result).toEqual([]);
  });
});
