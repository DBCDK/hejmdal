/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
import {
  logout,
  singleLogout,
  validateToken,
  gateWayfLogout
} from '../components/Logout/logout.component';
const router = Router();

router.get('/', validateToken, gateWayfLogout, singleLogout, logout);

export default router;
