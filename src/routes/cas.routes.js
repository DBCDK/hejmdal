import {Router} from 'express';
import {CONFIG} from '../utils/config.util';
import {promiseRequest} from '../utils/request.util';
const router = Router();

router.get('/:clientId/:agencyId/login', (req, res) => {
  const {clientId, agencyId} = req.params;
  const {service} = req.query;
  req.session.cas = {
    service,
    clientId,
    agencyId
  };
  //res.send('cas endpoint');
  // Validate client Id
  // Validate service url
  // Save service url on session
  // Redirect to authenticate endpoint
  res.redirect(
    `/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${
      CONFIG.app.host
    }/cas/callback&agency=${agencyId}`
  );
});

router.get('/callback', (req, res) => {
  //res.send(`ticket is ${req.query.code}`);
  // retrieve service url from session
  // redirect to service url with code.
  res.redirect(`${req.session.cas.service}?ticket=${req.query.code}`);
});

router.get('/:clientId/:agencyId/serviceValidate', async (req, res) => {
  // Exchange ticket/code for token
  const {ticket, service} = req.query;
  //await promiseRequest('/oauth/');
  // If valid token -> return valid reponse xml
  // If error -> return error xml
  res.set('Content-Type', 'text/xml');
  return res.send(validResponseXml('test'));
});

function validResponseXml(user) {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationSuccess>
      <cas:user>${user}</cas:user>
    </cas:authenticationSuccess>
  </cas:serviceResponse>`;
}

function invalidResponseXml(errorCode = 'INVALID_TICKET', ticket) {
  return `
  <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
    <cas:authenticationFailure code="${errorCode}">
      Ticket ${ticket} not recognized
    </cas:authenticationFailure>
  </cas:serviceResponse>`;
}

export default router;
