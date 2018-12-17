/**
 * @file
 * Methods for dealing with agencies
 */
import 'locale-compare-polyfill';
import {libraryListFromName} from '../components/OpenAgency/openAgency.client';

/**
 * @type {Array}
 */
let agencyList = [];
let uiBranchList = {};

/**
 *
 * @return {Array}
 */
export async function cacheAgencies(name = '') {
  agencyList = await libraryListFromName(name);
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
  if (!agencyList || !agencyList.length) {
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
      forsk: []
    };
    agencyList.forEach(branch => {
      if (!branch.agencyName) {
        return;
      }
      const type = branch.type === 'Forskningsbibliotek' ? 'forsk' : 'folk';
      uiBranchList[type].push({
        branchId: branch.branchId,
        name: branch.agencyName
      });
    });
    uiBranchList.folk.sort((b1, b2) => b1.name.localeCompare(b2.name, 'da-DK'));
    uiBranchList.forsk.sort((b1, b2) =>
      b1.name.localeCompare(b2.name, 'da-DK')
    );
  }
}

/**
 * For testing purposes
 *
 * @param mockList
 */
export function mockSetAgencyList(mockList) {
  agencyList = mockList;
}
