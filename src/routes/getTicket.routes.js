import Router from 'koa-router';
import {getTicket} from '../components/Ticket/ticket.component';

const router = new Router({prefix: '/getTicket'});

router.get('/:token/:id', getTicket);

export default router;
