/**
 * @file
 *
 */
import {CONFIG} from '../../utils/config.util';
import {VipCoreError} from './vipCore.errors';
import getMockClient from './mock/vipCore.client.mock';
import {promiseRequest} from '../../utils/request.util';
import {municipalityName} from '../../utils/municipality.util';
import {log} from '../../utils/logging.util';

/**
 * Retrieves a list of libraries
 *
 * @param text
 * @returns {Array}
 * @throws {VipCoreError}
 */
export async function libraryListFromName(text) {
  let response;

  // for test and development
  if (CONFIG.mock_externals.vipCore) {
    response = getMockClient(text);
  } else {
    response = await promiseRequest('post', {
      url: CONFIG.vipCore.uri + '/findlibrary/',
      body: {
        anyField: text ? text : '?',
        sort: ['agencyName']
      },
      json: true
    });
  }

  if (response.statusCode === 200) {
    const body = response.body;
    if (body.error) {
      const error = body.error;
      log.error('Error while retrieving result from VipCore', {
        error: error
      });
    }

    const checkLibraries = await getBorrowercheckLibraries();
    return parseFindLibraryResponse(response.body, checkLibraries);
  }

  throw new VipCoreError(response.statusMessage);
}

export async function libraryListFromPosition(
  latitude,
  longitude,
  distance = ''
) {
  let response;
  // for test and development
  if (CONFIG.mock_externals.vipCore) {
    response = getMockClient(latitude + '-' + longitude);
  } else {
    response = await promiseRequest('post', {
      url: CONFIG.vipCore.uri + '/findlibrary/',
      body: {
        pickupAllowed: 'true',
        latitude: latitude,
        longitude: longitude,
        distance: distance,
        sort: ['distance']
      },
      json: true
    });
  }

  if (response.statusCode === 200) {
    const checkLibraries = await getBorrowercheckLibraries();
    return parseFindLibraryResponse(response.body, checkLibraries);
  }

  throw new VipCoreError(response.statusMessage);
}

/** return an array with agencies that support borrowerCheck from login.bib.dk
 *
 * @returns {Array}
 */
async function getBorrowercheckLibraries() {
  if (CONFIG.mock_externals.vipCore) {
    return [];
  }
    let response;
    response = await promiseRequest('post', {
      url: CONFIG.vipCore.uri + '/borrowerchecklist/',
      body: {
        serviceRequester: 'login.bib.dk',
        borrowerCheckAllowed: 'true',
        trackingId: 'login.bib.dk'
      },
      json: true
    });

  if (response.statusCode === 200) {
    if (response.body && Array.isArray(response.body.borrowerCheckLibrary)) {
      const checkLibraries = [];
      response.body.borrowerCheckLibrary.forEach(agency => {
        if (agency.isil) {
          checkLibraries.push(agency.isil.toLowerCase().replace('dk-', ''));
        }
      });
      return checkLibraries;
    }
  }

  throw new VipCoreError(response.statusMessage);
}

/**
 * Parse findLibrary response and extract the few data needed
 *
 * @param response
 * @param checkLibraries
 * @returns {Array}
 */
function parseFindLibraryResponse(response, checkLibraries) {
  const noBorrowercheckSupport = [];
  const addBranchLibrary = [];
  const libraryList = [];
  if (response && Array.isArray(response.pickupAgency)) {
    const agencies = [];
    response.pickupAgency.forEach(agency => {
      const branchId = getAgencyField(agency, 'branchId');
      const branchType = getAgencyField(agency, 'branchType');

      if (!CONFIG.mock_externals.vipCore && !checkLibraries.includes(branchId)) {
        noBorrowercheckSupport.push(branchId);
        return;
      }
      if (agencies.includes(branchId) || (!['H', 'P'].includes(branchType))) {
        addBranchLibrary.push(branchId);
      }

      const item = {
        agencyId: getAgencyField(agency, 'agencyId'),
        branchId: branchId,
        agencyName: getAgencyField(agency, 'agencyName'),
        branchName: getAgencyField(agency, 'branchName'),
        branchShortName: getAgencyField(agency, 'branchShortName'),
        city: getAgencyField(agency, 'city'),
        address: getAgencyField(agency, 'postalAddress'),
        type: getAgencyField(agency, 'agencyType'),
        registrationFormUrl: getAgencyField(agency, 'registrationFormUrl'),
        branchWebsiteUrl: getAgencyField(agency, 'branchWebsiteUrl'),
        registrationFormUrlText: getAgencyField(agency, 'registrationFormUrlText'),
        branchEmail: getAgencyField(agency, 'branchEmail')
      };

      const municipalityNo = item.agencyId.substr(1, 3);
      if (item.type === 'Folkebibliotek' && municipalityName[item.agencyId]) {
        item.agencyName = municipalityName[item.agencyId];
        item.municipalityNo = municipalityNo;
      }
      if (agency.geolocation) {
        item.distance = getAgencyField(agency.geolocation, 'distanceInMeter');
      }

      libraryList.push(item);
      agencies.push(branchId);
    });
    if (noBorrowercheckSupport.length) {
      console.log('INFO: ' + noBorrowercheckSupport.sort() + ' does not support borrowercheck for login.bib.dk'); // eslint-disable-line no-console
    }
    if (addBranchLibrary.length) {
      console.log('INFO: ' + addBranchLibrary.sort() + ' branches supports borrowercheck for login.bib.dk'); // eslint-disable-line no-console
    }
  }

  return libraryList;
}

/**
 * Get (first) field
 *
 * @param buffer
 * @param field
 * @returns {string}
 */
function getAgencyField(buffer, field) {
  if (buffer[field]) {
    return !Array.isArray(buffer[field]) ? buffer[field]                         // eslint-disable-line no-nested-ternary
      : buffer[field][0].value ? buffer[field][0].value : buffer[field][0];
  }

  return '';
}
