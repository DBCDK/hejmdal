import {log} from '../utils/logging.util';
import {getUser} from '../components/User/user.component';
import {Router} from 'express';
const router = Router();

/**
 * Middleware for initializing oauth authorization.
 */
export function authenticate(req, res, next) {
  try {
    return req.app.oauth.authenticate()(req, res, next);
  } catch (error) {
    log.error('unhandledRejection in /userinfo', {
      errorMessage: error.message,
      stack: error.stack
    });
    next(error);
  }
}

router.get('/', authenticate, getUser);
router.post('/', authenticate, getUser);

export default router;
