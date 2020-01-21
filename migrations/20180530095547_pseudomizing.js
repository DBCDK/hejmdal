const {createHash, encrypt} = require('../src/utils/hash.utils');

const convertConsents = knex => {
  return knex
    .select(['consentid', 'consent'])
    .from('consent')
    .then(res => {
      const promises = res.map(row => {
        const consentId = row.consentid;
        const consent = row.consent;
        const match = consentId.match(/(.*):(.*)/);
        const userId = match[1];
        const serviceClientId = match[2];
        const hashedUserId = createHash(userId);
        const newConsentId = hashedUserId + ':' + serviceClientId;
        const encryptedConsent = encrypt(consent);

        return knex('consent')
          .where('consentid', '=', consentId)
          .update({
            consentid: newConsentId,
            consent: encryptedConsent
          })
          .catch(e => {
            throw new Error(e);
          });
      });
      return Promise.all(promises);
    });
};

const convertSessions = knex => {
  return knex
    .select(['id', 'session'])
    .from('session')
    .then(res => {
      const promises = res.map(row => {
        const id = row.id;
        const session = row.session;
        const encryptedSession = encrypt(session);

        return knex('session')
          .where('id', '=', id)
          .update({
            session: encryptedSession
          })
          .catch(e => {
            throw new Error(e);
          });
      });
      return Promise.all(promises);
    });
};

exports.up = function(knex) {
  return Promise.all([convertConsents(knex), convertSessions(knex)]).catch(
    e => {
      throw new Error(e);
    }
  );
};

exports.down = function() {};
