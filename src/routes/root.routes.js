/**
 * @file
 * Specifying the most simple routes
 */

import {Router} from 'express';

const router = Router();

import {renderFrontPage} from '../components/FrontPage/frontpage.component';
import sanityCheck from '../utils/sanityCheck.util';
import {log} from '../utils/logging.util';
import * as DBCIDP from '../components/DBCIDP/dbcidp.client';

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

// currently not used - newpasswordstep[12] now facilitates new/change dbcidp password
router.post('/newpassword', async (req, res) => {
  let {agencyId, identity} = req.body;

  const pwRequestSent = await DBCIDP.requestNewPassword({identity, agencyId});
  let status = 200;
  res.status(status);
  // close modal from here or go to a received page
  res.send(pwRequestSent);
});

router.post('/newpasswordstep1', async (req, res) => {
  let {agencyid, identity, hash} = req.body;

  const pwRequestSent = await DBCIDP.requestNewPasswordStep1({identity, agencyid, hash});
  let status = 200;
  res.status(status);
  res.send(pwRequestSent);
});

router.post('/newpasswordstep2', async (req, res) => {
  let {agencyid, identity, hash, secret, password} = req.body;

  const pwRequestSent = await DBCIDP.requestNewPasswordStep2({
    identity,
    agencyid,
    hash,
    secret,
    password
  });
  let status = 200;
  res.status(status);
  res.send(pwRequestSent);
});

// currently not used - newpasswordstep[12] now facilitates new/change dbcidp password
router.post('/changepassword', async (req, res) => {
  let {agencyId, identity, currPass, newPass} = req.body;

  const pwRequestSent = await DBCIDP.requestChangePassword({
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

// currently not used - newpasswordstep[12] now facilitates new/change dbcidp password
router.post('/validatepassword', async (req, res) => {
  let {agencyId, identity, newPass} = req.body;

  const pwRequestSent = await DBCIDP.requestValidatePassword({
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
