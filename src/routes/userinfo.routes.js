import {getTicket} from '../components/Ticket/ticket.component';
import {Router} from 'express';
const router = Router();


/**
 * Middleware for initializing oauth authorization.
 */
export function authenticate(req, res, next) {
  return req.app.oauth.authenticate()(req, res, next);
}


router.get('/', authenticate, getTicket);

export default router;

