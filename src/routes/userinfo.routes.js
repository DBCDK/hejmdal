import {getUser} from '../components/User/user.component';
import {Router} from 'express';
const router = Router();

/**
 * Middleware for initializing oauth authorization.
 */
export function authenticate(req, res, next) {
  return req.app.oauth.authenticate()(req, res, next);
}


router.get('/', authenticate, getUser);
router.post('/', authenticate, getUser);

export default router;

