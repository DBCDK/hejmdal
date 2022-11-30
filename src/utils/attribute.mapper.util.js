/**
 * @file
 *
 *  Maps data from CULR (and IDprovider) as specified by the Smaug-setting for the given serviceClient
 *
 */

import {log} from './logging.util';
import {CONFIG} from './config.util';
import {mapFromCpr} from './cpr.util';
import {getInstitutionsForUser} from '../components/UniLogin/unilogin.component';
import {getDbcidpAgencyRights, getDbcidpAgencyRightsAsFors, checkAgencyForProduct} from '../components/DBCIDP/dbcidp.client';

const removeAttributeAgencies = CONFIG.removeAttributeAgencies;

/**
 * Attribute mapper
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
export default async function mapAttributesToTicket(req, res, next) {
  const state = req.getState();
  const user = req.getUser();

  if (state && state.serviceClient && state.culr) {
    const serviceAttributes = state.serviceClient.attributes;
    const culr = state.culr;
    const ticketAttributes = await mapCulrResponse(
      culr,
      serviceAttributes,
      user,
      state.serviceClient.id
    );
    req.setState({ticket: {attributes: ticketAttributes}});
  }

  await next();
}

/**
 * Maps the response from CULR according to the given array of fields
 *
 * @param {object} culr The CULR reponse object
 * @param {object} attributes The attributes object defined in Smaug
 * @param {object} user data returned by the idp
 * @param clientId
 * @param accessToken
 * @see ATTRIBUTES
 * @returns {Promise<{}>}
 */
export async function mapCulrResponse(
  culr,
  attributes,
  user,
  clientId,
  accessToken
) {
  let mapped = {};
  let cpr = user.cpr || null;
  let agencies = [];
  let fromCpr = {};

  log.debug('mapCulrResponse', culr);

  if (culr.accounts && Array.isArray(culr.accounts)) {
    culr.accounts.forEach(account => {
      if (account.userIdType === 'CPR' && !cpr) {
        cpr = account.userIdValue;
      }

      agencies.push({
        agencyId: account.provider,
        userId: account.userIdValue,
        userIdType: account.userIdType
      });
    });
  } else if (cpr && user.agency) {
    agencies.push({
      agencyId: user.agency,
      userId: cpr,
      userIdType: 'CPR'
    });
  }

  if (cpr) {
    fromCpr = mapFromCpr(cpr);
  }

  const fields = Object.keys(attributes);

  await Promise.all(
    fields.map(async field => { // eslint-disable-line complexity
      // eslint-disable-line complexity
      try {
        switch (field) {
          case 'birthDate':
          case 'birthYear':
          case 'gender':
            mapped[field] = fromCpr[field] || null;
            break;
          case 'cpr':
            mapped.cpr = cpr;
            break;
          case 'allAgencies':
          case 'allLibraries':
            mapped.agencies = agencies;
            break;
          case 'agencies':
          case 'libraries':
            mapped.agencies = [];
            agencies.forEach((agency) => {
              if (!removeAttributeAgencies.includes(agency.agencyId)) {
                mapped.agencies.push(agency);
              }
            });
            break;
          case 'blocked':
            mapped.blocked = culr.blocked;
            break;
          case 'userPrivilege':
            mapped.userPrivilege = culr.userPrivilege;
            break;
          case 'municipality':
            mapped.municipality = culr.municipalityNumber || null;
            break;
          case 'municipalityAgencyId':
            mapped.municipalityAgencyId = culr.municipalityAgencyId || null;
            break;
          case 'uniloginId':
            mapped.uniloginId = user.uniloginId || null;
            break;
          case 'userId':
            mapped.userId = user.userId;
            break;
          case 'pincode':
            mapped.pincode = user.pincode;
            break;
          case 'wayfId':
            mapped.wayfId = user.wayfId ? user.wayfId : null;
            break;
          case 'uniqueId':
            mapped.uniqueId = culr.culrId;
            break;
          case 'uniLoginInstitutions': {
            mapped.uniLoginInstitutions =
              (user.uniloginId &&
                (await getInstitutionsForUser(user.uniloginId))) ||
              [];
            break;
          }
          case 'netpunktAgency':
            mapped.netpunktAgency = user.agency || null;
            break;
          case 'forsrights':
            mapped.forsrights = await getDbcidpAgencyRightsAsFors(accessToken, user);
            break;
          case 'dbcidp':
            mapped.dbcidp = await getDbcidpAgencyRights(accessToken, user);
            break;
          case 'agencyRights':
            mapped.agencyRights = await getAgencyProduct(attributes[field], user.agency);
            break;
          case 'municipalityAgencyRights':
            mapped.municipalityAgencyRights = await getAgencyProduct(attributes[field], culr.municipalityAgencyId);
            break;
          case 'idpUsed':
            mapped.idpUsed = user.userType;
            break;
          default:
            log.warn('Cannot map attribute: ' + field);
            break;
        }
      } catch (error) {
        log.error('Failed to map attribute: ' + field, {
          error: error.message,
          stack: error.stack
        });
      }
    })
  );

  return mapped;
}

/**
 *
 * @param products
 * @param agency
 * @returns {Promise<*[]>}
 */
async function getAgencyProduct(products, agency) {
  const res = [];
  if (products.length && agency) {
    await Promise.all(products.map(async (product) => {
      const hasProduct = await checkAgencyForProduct(agency, product);
      res.push({[product]: hasProduct});
    }));

  }
  return res;
}
