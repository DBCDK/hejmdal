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
      const checkLibraries = {};
      response.body.borrowerCheckLibrary.forEach(agency => {
        if (agency.isil) {
          const checkAgencyId = agency.isil.toLowerCase().replace('dk-', '');
          checkLibraries[checkAgencyId] = agency;
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
  const useLoginAgency = [];
  const libraryList = [];
  if (response && Array.isArray(response.pickupAgency)) {
    response.pickupAgency.forEach(agency => {
      const branchId = getAgencyField(agency, 'branchId');
      const branchType = getAgencyField(agency, 'branchType');
      const agencyType = getAgencyField(agency, 'agencyType');
      const isMunicipalityBranch = (agencyType === 'Folkebibliotek' && branchType === 'f');
      let loginAgencyId = checkLibraries[branchId] ? checkLibraries[branchId].loginAgencyId : branchId;
      if (!CONFIG.mock_externals.vipCore && !checkLibraries[branchId]) {
        if (isMunicipalityBranch) {
          loginAgencyId = getAgencyField(agency, 'agencyId');
        } else {
          noBorrowercheckSupport.push(branchId);
          return;
        }
      }

      const item = {
        agencyId: branchId,
        branchId: branchId,
        agencyName: '',
        borrowerCheckAllowed: !!checkLibraries[branchId],
        loginAgencyId: loginAgencyId,
        branchName: getAgencyField(agency, 'branchName'),
        branchShortName: getAgencyField(agency, 'branchShortName'),
        city: getAgencyField(agency, 'city'),
        address: getAgencyField(agency, 'postalAddress'),
        type: agencyType,
        registrationFormUrl: getAgencyField(agency, 'registrationFormUrl'),
        branchWebsiteUrl: getAgencyField(agency, 'branchWebsiteUrl'),
        registrationFormUrlText: getAgencyField(agency, 'registrationFormUrlText'),
        branchEmail: getAgencyField(agency, 'branchEmail')
      };
      if (item.type === 'Folkebibliotek') {
        item.municipalityNo = branchId.substr(1, 3);
      }
      if (agency.geolocation) {
        item.distance = getAgencyField(agency.geolocation, 'distanceInMeter');
      }
      if ((branchId !== item.loginAgencyId) && !isMunicipalityBranch) {
        useLoginAgency.push(branchId);
      }
      if (['H', 'P'].includes(branchType)) {
        item.agencyName = municipalityName[branchId] ?? getAgencyField(agency, 'agencyName');
      }
      else {
        item.agencyName = municipalityName[branchId] ?? (item.branchShortName ?? item.branchName);
        if (!isMunicipalityBranch) {
          addBranchLibrary.push(branchId);
        }
      }

      libraryList.push(item);
    });
    if (noBorrowercheckSupport.length) {
      console.log('INFO: ' + noBorrowercheckSupport.sort() + ' does not support borrowercheck for login.bib.dk'); // eslint-disable-line no-console
    }
    if (addBranchLibrary.length) {
      console.log('INFO: ' + addBranchLibrary.sort() + ' branches support borrowercheck for login.bib.dk'); // eslint-disable-line no-console
    }
    if (useLoginAgency.length) {
      console.log('INFO: ' + useLoginAgency.sort() + ' branches use different login agency'); // eslint-disable-line no-console
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
