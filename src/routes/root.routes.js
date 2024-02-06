/**
 * @file
 * Specifying the most simple routes
 */

import {Router} from 'express';

const router = Router();

import {renderFrontPage} from '../components/FrontPage/frontpage.component';
import sanityCheck from '../utils/sanityCheck.util';
import {log} from '../utils/logging.util';
import {requestNewPassword, requestChangePassword, requestValidatePassword} from '../components/DBCIDP/dbcidp.client';

router.get('/', renderFrontPage);

router.get('/health', async (req, res) => {
  const health = await sanityCheck(req.query.level ?? 'all');
  let status = 200;
  if (health.filter((e) => e.state === 'fail').length) {
    status = 503;
  }
  const healthMap = health.reduce((map, h) => ({...map, [h.name]: h}), {});
  log.debug('health', {
    health: healthMap,
    healthStatus: status
  });
  res.status(status);
  res.send(health);
});

router.post('/newpassword', async (req, res) => {
  let {agencyId, identity} = req.body;

  const pwRequestSent = await requestNewPassword({
    identity,
    agencyId
  });
  let status = 200;
  res.status(status);
  // close modal from here or go to a received page
  res.send(pwRequestSent);
});

router.post('/changepassword', async (req, res) => {
  let {agencyId, identity, currPass, newPass} = req.body;

  const pwRequestSent = await requestChangePassword({
    identity,
    agencyId,
    password: currPass,
    newPassword: newPass
  });
  let status = 200;
  res.status(status);
  // close modal from here or go to a received page
  res.send(pwRequestSent);
});

router.post('/validatepassword', async (req, res) => {
  let {agencyId, identity, newPass} = req.body;

  const pwRequestSent = await requestValidatePassword({
    identity,
    agencyId,
    password: newPass
  });
  let status = 200;
  res.status(status);
  // close modal from here or go to a received page
  res.send(pwRequestSent);
});

router.get('/fejl', (req) => {
  const state = req.getState();
  let link = null;
  if (state && state.smaugToken) {
    link = {
      href: `/login?token=${state.smaugToken}`,
      value: 'Prøv igen'
    };
  }
  const error =
    'Der er sket en fejl. Dette kan skyldes at du har klikket på et ugyldigt link.';
  req.render('Error', {error, link});
});

export default router;
