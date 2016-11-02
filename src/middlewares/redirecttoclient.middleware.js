/**
 * @file
 * Description...
 */

export async function redirectToClient(ctx, next){
  const ticketToken = ctx.getState().ticket.token;

  if(ticketToken){
    const host = ctx.getState().serviceClient.urls.host;
    const path = ctx.getState().serviceClient.urls.success;

    ctx.redirect(`${host}${path}?token=${ticketToken}`);
  }
  await next();
}
