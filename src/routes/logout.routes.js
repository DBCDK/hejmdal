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

router.get('/', validateToken, gateWayfLogout, logout);

export default router;
