import {Router} from 'express';

const router = Router();

import {
  authenticate,
  identityProviderCallback
} from '../components/Identityprovider/identityprovider.component';
import {
  setDefaultState,
  validateClientIsSet
} from '../middlewares/state.middleware';

router.get('/', validateClientIsSet, setDefaultState, authenticate);

router.get(
  '/identityProviderCallback/:type/:state',
  validateClientIsSet,
  setDefaultState,
  identityProviderCallback
);

router.post(
  '/identityProviderCallback/:type/:state',
  validateClientIsSet,
  setDefaultState,
  identityProviderCallback
);

router.get(
  '/identityProviderCallback/:type',
  validateClientIsSet,
  setDefaultState,
  identityProviderCallback
);

router.post(
  '/identityProviderCallback/:type',
  validateClientIsSet,
  setDefaultState,
  identityProviderCallback
);

export default router;
