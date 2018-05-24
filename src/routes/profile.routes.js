/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {profile} from '../components/Profile/profile.component';
import {getAttributes} from '../components/Smaug/smaug.component';
import {setDefaultState} from '../middlewares/state.middleware';
import {getToken} from '../components/Smaug/smaug.client';
import {CONFIG} from '../utils/config.util';

const router = new Router({prefix: '/profile'});

router.get(
  '/',
  async (ctx, next) => {
    const token = ctx.request.query.token || (await getToken(CONFIG.smaug.hejmdalClientId, null, '@', '@'));
    if (!ctx.hasUser()) {
      ctx.session.loginToProfile = true;
      const loginUrl = `/login?token=${token}`;
      ctx.redirect(loginUrl);
      return;
    }
    if (!ctx.request.query.token) {
      ctx.redirect(`/profile?token=${token}`);
      return;
    }
    ctx.session.loginToProfile = false;
    await next();
  },
  setDefaultState,
  getAttributes,
  profile
);

export default router;
