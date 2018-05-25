/**
 * @file
 * Handles logout
 */
import Router from 'koa-router'; // @see https://github.com/alexmingoia/koa-router
import {profile, consentsDeleted, confirmDeleteConsents} from '../components/Profile/profile.component';
import {deleteConsents} from '../components/Consent/consent.component';
import {logout} from '../components/Logout/logout.component';
import {getAttributes} from '../components/Smaug/smaug.component';
import {setDefaultState} from '../middlewares/state.middleware';
import {getToken} from '../components/Smaug/smaug.client';
import {CONFIG} from '../utils/config.util';

const router = new Router({prefix: '/profile'});

const checkLoggedIn = async (ctx, next) => {
  if (!ctx.hasUser()) {
    throw new Error('User not logged in');
  }
  await next();
};

router.get(
  '/',
  async (ctx, next) => {
    const token = ctx.request.query.token || (await getToken(CONFIG.smaug.hejmdalClientId, null, '@', '@'));
    if (!ctx.hasUser()) {
      const loginUrl = `/login?token=${token}&loginToProfile=1`;
      ctx.redirect(loginUrl);
      return;
    }
    if (!ctx.request.query.token) {
      ctx.redirect(`/profile?token=${token}`);
      return;
    }
    await next();
  },
  setDefaultState,
  getAttributes,
  profile
);

router.get(
  '/confirmDeleteConsents',
  checkLoggedIn,
  confirmDeleteConsents
);

router.post(
  '/deleteConsents',
  checkLoggedIn,
  deleteConsents,
  logout,
  consentsDeleted
);

export default router;
