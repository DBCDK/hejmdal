/**
 * @file
 * Methods for dealing with agencies
 */
import 'locale-compare-polyfill';
import {libraryListFromName} from '../components/VipCore/vipCore.client';
import {CONFIG} from './config.util';

/**
 * @type {Array}
 */
let agencyList = [];
let municipalityToAgencyList = {};
let uiBranchList = {};
let agencyRenewTime = Number.MAX_SAFE_INTEGER;

/** Fetch and refresh list of agencies supporting borchk
 *
 * @param name
 * @returns {Promise<void>}
 */
export async function cacheAgencies(name = '') {
  ({agencyList, municipalityToAgencyList} = await libraryListFromName(name));
  if (agencyList.length) {
    agencyRenewTime = new Date().getTime() + CONFIG.vipCore.life_time;
  }
}

/**
 *
 * @param filterParam
 * @returns {Promise<{}|*>}
 */
export async function getListOfAgenciesForFrontend(filterParam = null) {
  await setUiList();

  if (filterParam === 'forsk' || filterParam === 'folk') {
    return uiBranchList[filterParam];
  }
  return uiBranchList;
}

/** Handles exception for the general rule for municipality and agencyId
 *
 * @param municipality
 * @returns {Promise<null>}
 */
export async function getAgencyFromMunicipality(municipality) {
  await setAgencyList();
  return municipalityToAgencyList[municipality] ?? null;
}

/**
 * Return the name of the agency if found in agencyList
 *
 * @param agencyId
 * @returns {Promise<string>}
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

/**
 *
 * @param agencyId
 * @returns {Promise<{}>}
 */
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

/** agencyList setter
 *
 * @returns {Promise<void>}
 */
async function setAgencyList() {
  if (!agencyList || !agencyList.length || (new Date().getTime() > agencyRenewTime)) {
    await cacheAgencies(CONFIG.app.env === 'test' ? 'slagelse' : '');
  }
}

/** uiBranchList setter
 *
 * @returns {Promise<void>}
 */
async function setUiList() {
  await setAgencyList();

  if (agencyList.length || !uiBranchList.folk || !uiBranchList.folk.length) {
    uiBranchList = {
      folk: [],
      forsk: [],
      other: []
    };
    agencyList.forEach(branch => {
      const type = getType(branch);
      if (branch.agencyName && branch.borrowerCheckAllowed && type) {
        uiBranchList[type].push({
          branchId: branch.branchId,
          name: branch.agencyName,
          registrationUrl: branch.registrationFormUrl || branch.branchWebsiteUrl
        });
      }
    });
    uiBranchList.folk.sort((b1, b2) => b1.name.localeCompare(b2.name, 'da-DK'));
    uiBranchList.forsk.sort((b1, b2) => b1.name.localeCompare(b2.name, 'da-DK'));
  }
}

/**
 *
 * @param branch
 * @returns {string}
 */
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
