import {Router} from 'express';

const router = Router();

import {getAttributes} from '../components/Smaug/smaug.component';
import {
  authenticate,
  identityProviderCallback
} from '../components/Identityprovider/identityprovider.component';
import {setDefaultState} from '../middlewares/state.middleware';

router.get('/', setDefaultState, getAttributes, authenticate);

router.get('/identityProviderCallback/:type/:state', identityProviderCallback);

router.post('/identityProviderCallback/:type/:state', identityProviderCallback);

export default router;
