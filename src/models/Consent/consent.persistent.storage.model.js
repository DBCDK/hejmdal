/**
 * @file
 * Storage model for persistent storage of consents
 */

import Consent from '../db_models/consent.model';
import {log} from '../../utils/logging.util';

export default class PersistentConsentStorage {

  read(consentid) {
    return Consent.query().select('consent').where('consentid', consentid)
      .then((result) => {
        return result.length ? result[0].consent : null;
      })
      .catch((error) => {
        log.error('Failed to get consent', {error: error.message});
        return null;
      });
  }

  insert(consentid, consent) {
    return Consent.query().insert({consentid: consentid, consent: consent})
      .catch((error) => {
        log.error('Failed to set consent', {error: error.message});
      });
  }

  delete(consentid) {
    return Consent.query().delete().where('consentid', consentid)
      .then(() => {
        return true;
      })
      .catch((error) => {
        log.error('Failed to delete consent', {error: error.message});
        return false;
      });
  }
}
