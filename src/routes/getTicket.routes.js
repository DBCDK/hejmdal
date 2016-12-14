import Router from 'koa-router';
import {VERSION_PREFIX} from '../utils/version.util';
import {getTicket} from '../components/Ticket/ticket.component';

const router = new Router({prefix: VERSION_PREFIX + '/getTicket'});

router.get('/:token/:id', getTicket);

export default router;
