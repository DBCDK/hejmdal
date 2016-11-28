/**
 * @file
 * Methods for dealing with agencies
 */

import {libraryListFromName} from '../components/OpenAgency/openAgency.client';

/**
 * @type {Array}
 */
let agencyList = [];
let uiList = [];

/**
 *
 * @return {Array}
 */
export async function cacheAgencies() {
  agencyList = await libraryListFromName('');
}

/**
 *
 * @return {Array}
 */
export async function getListOfAgenciesForFrontend() {
  await setUiList();

  return uiList;
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
    agencyList.forEach((agency) => {
      if (agency.branchId === agencyId) {
        name = agency.name;
      }
    });
  }
  return name;
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
 * uiList setter
 */
async function setUiList() {
  await setAgencyList();

  if (!uiList || !uiList.length) {
    uiList = agencyList.map((agency) => {
      return {branchId: agency.branchId, name: agency.name};
    });
  }
}

/**
 * For testing purposes
 *
 * @param list
 */
export function mockSetAgencyList(mockList) {
  agencyList = mockList;
}
