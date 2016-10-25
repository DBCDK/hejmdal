/**
 * @file
 *
 *  Maps data from CULR (and IDprovider) as specified by the Smaug-setting for the given serviceClient
 *
 */

/**
 * Attribute mapper
 *
 * @param ctx
 * @param next
 * @returns {*}
 */
export default async function mapAttributesToTicket(ctx, next) {
  const state = ctx.getState();

  if (state && state.serviceClient && state.culr) {
    const serviceAttributes = state.serviceClient.attributes;
    const culr = state.culr;

    const ticketAttributes = mapCulrResponse(culr, serviceAttributes);

    ctx.setState({ticket: {attributes: ticketAttributes}});
  }

  await next();
}

/**
 * Maps the response from CULR according to the given array of fields
 *
 * @param {object} culr The CULR reponse object
 * @param {Array} fields The array of fields defined in Smaug
 * @return {{}}
 */
function mapCulrResponse(culr, fields) {
  let mapped = {};

  let cpr = null;
  let libraries = [];

  if (culr.accounts && Array.isArray(culr.accounts)) {
    culr.accounts.forEach((account) => {
      if (account.userIdType === 'CPR' && !cpr) {
        cpr = account.userIdValue;
      }

      libraries.push({
        libraryid: account.provider,
        loanerid: account.userIdValue
      });
    });
  }

  if (fields.includes('cpr')) {
    mapped.cpr = cpr;
  }

  if (fields.includes('libraries')) {
    mapped.libraries = libraries;
  }

  if (fields.includes('municipality')) {
    mapped.municipality = culr.municipalityNumber || null;
  }

  return mapped;
}
