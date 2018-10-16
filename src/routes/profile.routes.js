/**
 * @file
 * Handles logout
 */
import {Router} from 'express';
const router = Router();

import passport from 'passport';


import {profile, consentsDeleted, confirmDeleteConsents} from '../components/Profile/profile.component';
import {deleteConsents} from '../components/Consent/consent.component';

router.get('/provider', passport.authenticate('profile'));
router.get('/provider/callback', passport.authenticate('profile', {
  failureRedirect: '/error'
}),
(req, res) => { //eslint-disable-line
  res.redirect('/profile');
});

router.get('/', (req, res, next) => {
  const user = req.getUser();
  if (!user || !user.userId) {
    res.redirect('/profile/provider');
  } else {
    next();
  }
}, profile);

router.get(
  '/confirmDeleteConsents',
  confirmDeleteConsents
);

router.post(
  '/deleteConsents',
  deleteConsents,
  consentsDeleted
);

export default router;
