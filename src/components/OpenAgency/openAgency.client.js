/**
 * @file
 *
 */
import {CONFIG} from '../../utils/config.util';
import {OpenAgencyError} from './openAgency.errors';
import getMockClient from './mock/openAgency.client.mock';
import {promiseRequest} from '../../utils/request.util';
import {municipalityName} from '../../utils/municipality.util';
import {log} from '../../utils/logging.util';

/**
 * Retrieves a list of libraries
 *
 * @param text
 * @returns {Array}
 * @throws {OpenAgencyError}
 */
export async function libraryListFromName(text) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.openAgency) {
    response = getMockClient(text);
  } else {
    response = await promiseRequest('get', {
      uri: CONFIG.openAgency.uri,
      qs: {
        anyField: text,
        sort: 'agencyName'
      }
    });
  }

  if (response.statusCode === 200) {
    const body = JSON.parse(response.body);
    if (body.findLibraryResponse && body.findLibraryResponse.error) {
      const error = body.findLibraryResponse.error.$;
      log.error('Error while retrieving result from OpenAgency', {
        error: error
      });
    }

    return parseFindLibraryResponse(JSON.parse(response.body));
  }

  throw new OpenAgencyError(response.statusMessage);
}

export async function libraryListFromPosition(
  latitude,
  longitude,
  distance = ''
) {
  let response;
  // for test and development
  if (CONFIG.mock_externals.openAgency) {
    response = getMockClient(latitude + '-' + longitude);
  } else {
    response = await promiseRequest('get', {
      uri: CONFIG.openAgency.uri,
      qs: {
        latitude: latitude,
        longitude: longitude,
        distance: distance,
        sort: 'distance'
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
  if (
    response.findLibraryResponse &&
    Array.isArray(response.findLibraryResponse.pickupAgency)
  ) {
    const agencies = [];
    response.findLibraryResponse.pickupAgency.forEach(agency => {
      const branchId = getAgencyField(agency, 'branchId');
      let branchType = getAgencyField(agency, 'branchType');
      let agencyType = getAgencyField(agency, 'agencyType');

      // Quick fix
      // Some agencies need to be handled as folkebiblioteker
      // even though they are not.
      // A better solution has to be found
      const FORCE_FOLKEBIBLIOTEK = ['911116'];
      if (FORCE_FOLKEBIBLIOTEK.includes(branchId)) {
        branchType = 'H';
        agencyType = 'Folkebibliotek';
      }

      if (agencies.includes(branchId) || branchType !== 'H') {
        return;
      }

      const item = {
        agencyId: getAgencyField(agency, 'agencyId'),
        branchId: branchId,
        agencyName: getAgencyField(agency, 'agencyName'),
        branchName: getAgencyField(agency, 'branchName'),
        branchShortName: getAgencyField(agency, 'branchShortName'),
        city: getAgencyField(agency, 'city'),
        address: getAgencyField(agency, 'postalAddress'),
        type: agencyType,
        registrationFormUrl: getAgencyField(agency, 'registrationFormUrl'),
        branchWebsiteUrl: getAgencyField(agency, 'branchWebsiteUrl'),
        registrationFormUrlText: getAgencyField(
          agency,
          'registrationFormUrlText'
        ),
        branchEmail: getAgencyField(agency, 'branchEmail')
      };

      const municipalityNo = item.agencyId.substr(1, 3);
      if (
        (item.agencyId.indexOf('7') === 0 ||
          FORCE_FOLKEBIBLIOTEK.includes(branchId)) &&
        item.type === 'Folkebibliotek' &&
        municipalityName[municipalityNo]
      ) {
        item.agencyName = municipalityName[municipalityNo];
        item.municipalityNo = municipalityNo;
      }
      if (agency.geolocation) {
        item.distance = getAgencyField(agency.geolocation, 'distanceInMeter');
      }

      libraryList.push(item);
      agencies.push(branchId);
    });
  }

  return libraryList;
}

/**
 * Get (first) field from BadgerFish json format.    // http://badgerfish.ning.com/
 *
 * @param buffer
 * @param field
 * @returns {string}
 */
function getAgencyField(buffer, field) {
  if (buffer[field]) {
    return Array.isArray(buffer[field]) ? buffer[field][0].$ : buffer[field].$;
  }

  return '';
}
