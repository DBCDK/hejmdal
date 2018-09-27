import {Router} from 'express';

const router = Router();
import * as Consent from '../components/Consent/consent.component';

router.get('/', Consent.giveConsentUI);
router.post('/:token', Consent.consentSubmit);

export default router;
