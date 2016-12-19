import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {showInfo} from '../components/Info/info.component';

const router = new Router({prefix: VERSION_PREFIX + '/info'});

router.get('/:infoId', showInfo);
router.get('/:infoId/:localId', showInfo);

export default router;
