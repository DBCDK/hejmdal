/**
 * @file
 *
 */
import {CONFIG} from '../../utils/config.util';
import {OpenAgencyError} from './openAgency.errors';
import getMockClient from './mock/openAgency.client.mock';
import {promiseRequest} from '../../utils/request.util';

/**
 * Retrieves a list of libraries
 *
 * @param {text}
 * @returns {Array}
 * @throws {OpenAgencyError}
 */
export async function suggestLibraryList(text) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.openAgency) {
    response = getMockClient(text);
  }
  else {
    response = await promiseRequest('get', {
      uri: CONFIG.openAgency.uri,
      qs: {
        anyField: text,
        sort: 'agencyName'
      }
    });
  }

  if (response.statusCode === 200) {
    return parseFindLibraryResponse(JSON.parse(response.body));
  }

  throw new OpenAgencyError(response.statusMessage);
}

/**
 * Parse findLibrary repsonse and extract the few data needed
 *
 * @param response
 * @returns {Array}
 */
function parseFindLibraryResponse(response) {
  const libraryList = [];
  if (response.findLibraryResponse && Array.isArray(response.findLibraryResponse.pickupAgency)) {
    response.findLibraryResponse.pickupAgency.forEach((agency) => {
      libraryList.push({
        id: getAgencyField(agency, 'agencyId'),
        branchId: getAgencyField(agency, 'branchId'),
        name: getAgencyField(agency, 'branchName'),
        address: getAgencyField(agency, 'postalAddress'),
        type: getAgencyField(agency, 'agencyType')
      });
    });
  }
  return libraryList;
}

/**
 * Get (first) field from BadgerFish json format.    // http://badgerfish.ning.com/
 *
 * @param buffer
 * @param field
 * @returns {*}
 */
function getAgencyField(buffer, field) {
  if (buffer[field]) {
    return Array.isArray(buffer[field]) ? buffer[field][0].$ : buffer[field].$;
  }

  return '';
}
