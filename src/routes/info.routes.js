import Router from 'koa-router';
import {showInfo} from '../components/Info/info.component';

const router = new Router({prefix: '/info'});

router.get('/:infoId', showInfo);
router.get('/:infoId/:localId', showInfo);

export default router;
