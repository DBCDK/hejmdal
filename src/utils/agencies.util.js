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
  if (!AgencyList || !AgencyList.length) {
    await cacheAgencies();
  }

  if (!uiList || !uiList.length) {
    uiList = AgencyList.map((agency) => {
      return {branchId: agency.branchId, name: agency.name}
    });
  }

  return uiList;
}
