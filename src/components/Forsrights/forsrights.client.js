/**
 * @file
 * Client for communicating with the forsrights service
 */

import {getDbcidpAgencyRights, validateIdpUser} from '../DBCIDP/dbcidp.client';
import {log} from '../../utils/logging.util';

/**
 * Function to retrieve (MULTIPLE) agency rights from forsrights service
 *
 * @param {string} accessToken
 * @param {object} user information
 * @return {array}
 */
export async function getAgencyRights(accessToken, user) {
  log.info('FORS getAgencyRights', {user: user});
  const dbcidp = await getDbcidpAgencyRights(accessToken, user);

  const fakeFors = [];
  dbcidp.forEach((agency) => {
    const fors = {agencyId: agency.agencyId, rights: {}};
    if (agency.rights && Array.isArray(agency.rights)) {
      agency.rights.forEach((product) => {
        fors.rights[product.productName.toLowerCase()] = ['500', '501'];
      });
    }
    fakeFors.push(fors);
  });

  return fakeFors;
}

/**
 * Function to validate if a 'netpunkt-triple-login' is valid
 * The validation is done against the forsrights service.
 *
 * @param userIdAut
 * @param groupIdAut
 * @param passwordAut
 * @return {boolean}
 */
export async function validateNetpunktUser(userIdAut, groupIdAut, passwordAut) {
  log.info('FORS validateNetpunktUser', {user: {userIdAut: userIdAut, groupIdAut: groupIdAut}});
  return await validateIdpUser(userIdAut, groupIdAut, passwordAut);
}
