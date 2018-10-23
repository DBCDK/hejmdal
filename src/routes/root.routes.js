/**
 * @file
 * Specifying the most simple routes
 */

import {Router} from 'express';

const router = Router();

import {renderFrontPage} from '../components/FrontPage/frontpage.component';
import sanityCheck from '../utils/sanityCheck.util';

router.get('/', renderFrontPage);

router.get('/health', async (req, res) => {
  const health = await sanityCheck();
  res.status = 200;
  if (health.filter(e => e.state === 'fail').length) {
    res.status = 503;
  }

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
