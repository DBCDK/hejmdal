/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
  req.session.user = null;
  if (req.query.access_token) {
    req.app.oauth.server.options.model.revokeToken(req.query.access_token);
  }
  res.send('User is logged out');
});

export default router;
