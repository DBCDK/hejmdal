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
export default function mapAttributesToTicket(ctx, next) {
  const state = ctx.getState();
  if (state && state.serviceClient && state.culr) {
    const ticketAttributes = state.ticket.attributes || {};
    const serviceAttributes = state.serviceClient.attributes;
    const culr = state.culr.attributes;
    serviceAttributes.forEach((attr) => {
      if (culr[attr]) {
        ticketAttributes[attr] = culr[attr];
      }
    });
    ctx.setState({ticket: {attributes: ticketAttributes}});
  }
  return next();
}
