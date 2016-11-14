/**
 * @file
 * Unittesting methods in unilogin.component
 */

import {assert} from 'chai';
import {validateUniloginTicket} from '../unilogin.component.js';
import {md5} from "../../../utils/hash.utils";
import {CONFIG} from "../../../utils/config.util";
import moment from "moment";

describe('Unittesting methods in unilogin.component', () => {

  let ticket = {};

  beforeEach(() => {
    const user = 'test1234';
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const auth = md5(timestamp + CONFIG.unilogin.secret + user);
    ticket = {
      auth: auth,
      timestamp: timestamp,
      user: user,
    };
  });

  it('Should succesfully validate ticket', () => {
    const result = validateUniloginTicket(ticket);
    assert.isTrue(result);
  });

  it('Should reject ticket because of age', () => {
    ticket.timestamp = '19700101010100';
    const result = validateUniloginTicket(ticket);
    assert.isFalse(result);
  });

  it('Should reject ticket because of invalid auth', () => {
    ticket.auth = 'invalid-auth';
    const result = validateUniloginTicket(ticket);
    assert.isFalse(result);
  });
});
