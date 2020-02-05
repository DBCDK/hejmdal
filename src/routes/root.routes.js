/**
 * @file
 * Specifying the most simple routes
 */

import {Router} from 'express';

const router = Router();

import {renderFrontPage} from '../components/FrontPage/frontpage.component';
import sanityCheck from '../utils/sanityCheck.util';
import {log} from '../utils/logging.util';

router.get('/', renderFrontPage);

router.get('/health', async (req, res) => {
  const health = await sanityCheck();
  let status = 200;
  if (health.filter(e => e.state === 'fail').length) {
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

router.get('/fejl', req => {
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
