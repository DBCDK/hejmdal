import {Router} from 'express';

const router = Router();

import {getAttributes} from '../components/Smaug/smaug.component';
import {
  authenticate,
  identityProviderCallback
} from '../components/Identityprovider/identityprovider.component';
import {setDefaultState} from '../middlewares/state.middleware';

router.get('/', setDefaultState, getAttributes, authenticate);

router.get('/identityProviderCallback/:type/:token', identityProviderCallback);

router.post('/identityProviderCallback/:type/:token', identityProviderCallback);

export default router;
