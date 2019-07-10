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
  const {returnurl} = req.query;
  if (!req.query.singlelogout) {
    return next();
  }
  res.render('SingleLogout', {clients, returnurl});
}

router.get('/', singleLogout, validateToken, gateWayfLogout, logout);

export default router;
