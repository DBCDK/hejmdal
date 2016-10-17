/**
 * @file
 * Description...
 */

import KeyValueStorage from '../../models/keyvalue.storage.model';
import PersistentConsentStorage from '../../models/Consent/consent.persistent.storage.model';

export default class ConsentStore {
  constructor() {
    this.Store = new KeyValueStorage(new PersistentConsentStorage());
  }

  /**
   * Stores the given consentObj associated with the given userid in the store
   *
   * @param {string} userid
   * @param {object} consentObj
   */
  setConsent(userid, consentObj) {
    const result = this.Store.insert(userid, consentObj);
    console.log('setConsent: ', result); // eslint-disable-line no-console
  }

  /**
   * Attempts to retreve consent from the consent store for a given user.
   *
   * @param {string} key
   */
  getConsent(key) {
    return this.Store.read(key)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log('getConsent::err: ', err); // eslint-disable-line no-console
        return false;
      });
  }
}
