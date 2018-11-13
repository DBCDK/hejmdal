import {getUser} from '../components/User/user.component';
import {Router} from 'express';
const router = Router();

/**
 * Middleware for initializing oauth authorization.
 */
export function authenticate(req, res, next) {
  return req.app.oauth.authenticate()(req, res, next);
}

function mockUser(req, res, next) {
  const {user: userId, client: clientId} = res.locals.oauth.token;
  if (
    clientId === 'hejmdal' &&
    (userId === '0101701234' || userId === '87654321')
  ) {
    res.json({
      attributes: {
        userId: '0101701234',
        uniqueId:
          '8aa45d6b9e2cdec5322fa4c35cfd3ea271a3981ffcb5f75a994029522a3ec1a9',
        agencies: [
          {
            agencyId: '710100',
            userId: '0101701234',
            userIdType: 'CPR'
          },
          {
            agencyId: '714700',
            userId: '12345678',
            userIdType: 'LOCAL'
          }
        ]
      }
    });
  } else {
    next();
  }
}

router.get('/', authenticate, mockUser, getUser);
router.post('/', authenticate, mockUser, getUser);

export default router;
