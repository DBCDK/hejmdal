import {Router} from 'express';

const router = Router();

import {
  authenticate,
  identityProviderCallback
} from '../components/Identityprovider/identityprovider.component';
import {setDefaultState, validateClientIsSet} from '../middlewares/state.middleware';

router.get('/', validateClientIsSet, setDefaultState, authenticate);

router.get('/identityProviderCallback/:type/:state', identityProviderCallback);

router.post('/identityProviderCallback/:type/:state', identityProviderCallback);

export default router;
