/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
import {
  logout,
  validateToken,
  gateWayfLogout
} from '../components/Logout/logout.component';
const router = Router();

function singleLogout(req, res, next) {
  const {clients = []} = req.session;
  if (!req.query.singlelogout) {
    return next();
  }
  res.send(clients.map(client => client.clientId).join(', '));
}

router.get('/', singleLogout, validateToken, gateWayfLogout, logout);

export default router;
