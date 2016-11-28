/**
 * @file
 * Methods for dealing with agencies
 */

import {libraryListFromName} from '../components/OpenAgency/openAgency.client';

/**
 * @type {Array}
 */
let AgencyList = [];
let uiList = [];

/**
 *
 */
export async function cacheAgencies() {
  AgencyList = await libraryListFromName('');
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
 * Return the name of the agency if found in agency list
 *
 * @param agencyId
 * @param agencyList
 * @returns {*}
 */
export async function getAgencyName(agencyId) {
  await setAgencyList();

  let name = '';
  if (agencyId) {
    name = 'Ukendt bibliotek: ' + agencyId;
    AgencyList.forEach((agency) => {
      if (agency.branchId === agencyId) {
        name = agency.name;
      }
    });
  }
  return name;
}

async function setAgencyList() {
  if (!AgencyList || !AgencyList.length) {
    await cacheAgencies();
  }
}

async function setUiList() {
  await setAgencyList();

  if (!uiList || !uiList.length) {
    uiList = AgencyList.map((agency) => {
      return {branchId: agency.branchId, name: agency.name};
    });
  }
}
