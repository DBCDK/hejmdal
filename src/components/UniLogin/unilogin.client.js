/**
 * @file
 * Provides UNI-Login integration
 */

import {CONFIG} from '../../utils/config.util';
import {promiseRequest} from '../../utils/request.util';
import {parseString} from 'xml2js';

/**
 * Get list of institutionIds for User.
 *
 * @export
 * @param {String} userId
 * @returns {Array} List of institution Ids.
 */
export async function getInstitutionIdsForUser(userId) {
  const body = `
    <S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:C="https://uni-login.dk" xmlns:A="https://wsibruger.uni-login.dk/ws">
      <S:Header>
      </S:Header>
      <S:Body>
          <A:hentBrugersInstitutionstilknytninger>
            <C:wsBrugerid>${CONFIG.unilogin.wsUser}</C:wsBrugerid>
            <C:wsPassword>${CONFIG.unilogin.wsPassword}</C:wsPassword>
            <A:brugerid>${userId}</A:brugerid>
          </A:hentBrugersInstitutionstilknytninger>
      </S:Body>
  </S:Envelope>`;

  const response = await promiseRequest('post', {
    uri: 'https://wsibruger.uni-login.dk/wsibruger-v4/ws?WSDL',
    body
  });

  return new Promise(resolve => {
    parseString(response.body, (err, result) => {
      resolve(parseInstitutions(result));
    });
  });
}

/**
 * Extract institution ID's from SOAP response.
 *
 * @param {*} soapResponse
 * @returns
 */
function parseInstitutions(soapResponse) {
  try {
    return soapResponse['S:Envelope']['S:Body'][0][
      'wib:hentBrugersInstitutionstilknytningerResponse'
    ][0]['wib:institutionstilknytning'].map(el => {
      return el['uni:instnr'][0];
    });
  } catch (e) {
    return [];
  }
}

/**
 * Get information for a list of institutions
 *
 * @export
 * @param {Array} institutionIds
 * @returns {Array} List of institutions
 */
export async function getInstitutionInformation(institutionIds) {
  const body = `
    <S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:C="https://uni-login.dk" xmlns:A="https://wsiinst.uni-login.dk/ws">
      <S:Header>
      </S:Header>
      <S:Body>
        <A:hentInstitutioner>
          <C:wsBrugerid>${CONFIG.unilogin.wsUser}</C:wsBrugerid>
          <C:wsPassword>${CONFIG.unilogin.wsPassword}</C:wsPassword>
          ${institutionIds.map(id => `<A:instnr>${id}</A:instnr>`).join('')}
        </A:hentInstitutioner>
      </S:Body>
    </S:Envelope>`;
  const response = await promiseRequest('post', {
    uri: 'https://wsiinst.uni-login.dk/wsiinst-v2/ws?WSDL',
    body
  });
  return new Promise(resolve => {
    parseString(response.body, (err, result) => {
      resolve(parseInstitutionInformation(result));
    });
  });
}

/**
 * Extract Information about institutions from SOAP response.
 *
 * @param {*} soapResponse
 * @returns
 */
function parseInstitutionInformation(soapResponse) {
  try {
    return soapResponse['S:Envelope']['S:Body'][0][
      'wii:hentInstitutionerResponse'
    ][0]['wii:institution'].map(el => {
      return {
        id: el['uni:instnr'][0],
        name: el['uni:instnavn'][0]
      };
    });
  } catch (e) {
    return [];
  }
}
