/**
 * @file
 * Methods for dealing with agencies
 */
import 'locale-compare-polyfill';
import {libraryListFromName} from '../components/OpenAgency/openAgency.client';
import {CONFIG} from './config.util';

/**
 * @type {Array}
 */
let agencyList = [];
let uiBranchList = {};
let agencyRenewTime = Number.MAX_SAFE_INTEGER;

/**
 *
 * @return {Array}
 */
export async function cacheAgencies(name = '') {
  agencyList = await libraryListFromName(name);
  if (agencyList.length) {
    agencyRenewTime = new Date().getTime() + CONFIG.openAgency.life_time;
  }
}

/**
 *
 * @return {Array}
 */
export async function getListOfAgenciesForFrontend(filterParam = null) {
  await setUiList();

  if (filterParam === 'forsk' || filterParam === 'folk') {
    return uiBranchList[filterParam];
  }
  return uiBranchList;
}

/**
 * Return the name of the agency if found in agencyList
 *
 * @param agencyId
 * @returns {*}
 */
export async function getAgencyName(agencyId) {
  await setAgencyList();

  let name = '';
  if (agencyId) {
    name = 'Ukendt bibliotek: ' + agencyId;
    agencyList.forEach(agency => {
      if (agency.branchId === agencyId) {
        name = agency.branchName;
      }
    });
  }
  return name;
}

export async function getAgency(agencyId) {
  await setAgencyList();

  let ret = {};
  if (agencyId) {
    agencyList.forEach(agency => {
      if (agency.branchId === agencyId) {
        ret = agency;
      }
    });
  }

  return ret;
}

/**
 * agencyList setter
 */
async function setAgencyList() {
  if (!agencyList || !agencyList.length || (new Date().getTime() > agencyRenewTime)) {
    await cacheAgencies();
  }
}

/**
 * uiBranchList setter
 */
async function setUiList() {
  await setAgencyList();

  if (!uiBranchList.folk || !uiBranchList.folk.length) {
    uiBranchList = {
      folk: [],
      forsk: [],
      other: []
    };
    agencyList.forEach(branch => {
      const type = getType(branch);
      if (!branch.agencyName || !type) {
        return;
      }
      uiBranchList[type].push({
        branchId: branch.branchId,
        name: branch.agencyName,
        registrationUrl: branch.registrationFormUrl || branch.branchWebsiteUrl
      });
    });
    uiBranchList.folk.sort((b1, b2) => b1.name.localeCompare(b2.name, 'da-DK'));
    uiBranchList.forsk.sort((b1, b2) =>
      b1.name.localeCompare(b2.name, 'da-DK')
    );
  }
}

function getType(branch) {
  if (branch.type === 'Forskningsbibliotek') {
    return 'forsk';
  }
  if (branch.municipalityNo) {
    return 'folk';
  }
  return 'other';
}

/**
 * For testing purposes
 *
 * @param mockList
 */
export function mockSetAgencyList(mockList) {
  agencyList = mockList;
}
