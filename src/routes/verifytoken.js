import {Router} from 'express';

const router = Router();

import {setDefaultState} from '../middlewares/state.middleware';
import {verifyToken} from '../components/VerifyToken/verifyToken.component';

router.get('/verifyToken', setDefaultState, verifyToken);

export default router;
