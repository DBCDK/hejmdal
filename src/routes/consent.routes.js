import {Router} from 'express';

const router = Router();
import * as Consent from '../components/Consent/consent.component';

router.get('/consent', Consent.giveConsentUI);
router.post('/consentsubmit/:token', Consent.consentSubmit);

export default router;
