/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
import {
  logout,
  singleLogout,
  validateToken,
  gateWayfLogout,
  unloginOidcLogout
} from '../components/Logout/logout.component';
const router = Router();

router.get('/', validateToken, gateWayfLogout, unloginOidcLogout, singleLogout, logout);

export default router;
