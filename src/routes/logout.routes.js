/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
import {logout} from '../components/Logout/logout.component';
const router = Router();

router.get('/', logout);

export default router;
