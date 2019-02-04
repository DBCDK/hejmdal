import {Router} from 'express';
import {showInfo} from '../components/Info/info.component';

const router = Router();

router.get('/:infoId', showInfo);

export default router;
