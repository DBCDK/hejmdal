/**
 * @file
 * Consent component handling the nessecary consent
 */
import {CONFIG} from '../../utils/config.util';
import {createHash} from '../../utils/hash.utils';
import KeyValueStorage from '../../models/keyvalue.storage.model';
import MemoryStorage from '../../models/memory.storage.model';
import PersistentConsentStorage from '../../models/Consent/consent.persistent.storage.model';
import {log} from '../../utils/logging.util';
import {getText} from '../../utils/text.util';
import buildReturnUrl from '../../utils/buildReturnUrl.util';

const consentStore = CONFIG.mock_storage
  ? new KeyValueStorage(new MemoryStorage())
  : new KeyValueStorage(new PersistentConsentStorage());

/**
 * Renders the consent UI
 *
 * @param {object} req
 * @param {object} res
 */
export async function giveConsentUI(req, res) {
  const state = req.getState();
  if (!state || !state.serviceClient || !state.serviceClient.clientId) {
    res.redirect('/fejl');
  } else {
    const returnUrl = state.returnUrl
      ? state.serviceClient.urls.host + state.returnUrl
      : '';
    const helpText = getText(['consent'], {
      __SERVICE_CLIENT_NAME__: state.serviceClient.name
    });
    res.render('Consent', {
      attributes: getConsentAttributes(state),
      consentAction: '/consent/' + state.stateHash,
      consentFailed: false,
      returnUrl: returnUrl,
      serviceName: state.serviceClient.name,
      help: helpText
    });
  }
}

/**
 * Submit handler for consent submission. If consent is rejected the session is cleared.
 * If consent is given, it is saved and the flow continues.
 *
 * @param {object} req
 * @param {object} res
 */
export async function consentSubmit(req, res) {
  const response = req.body || req.query;

  if (
    !response ||
    !response.userconsent ||
    (response.userconsent && response.userconsent === '0')
  ) {
    const state = req.getState();
    const returnUrl = buildReturnUrl(state, {error: 'consent was rejected'});
    const serviceClientName = state.serviceClient.name;
    const helpText = getText(['consentReject'], {
      __SERVICE_CLIENT_NAME__: serviceClientName
    });

    // Remove current identityProvider from list of used providers
    req.resetUser(req.getUser().userType);

    res.render('Consent', {
      consentFailed: true,
      returnUrl: returnUrl,
      serviceName: serviceClientName,
      help: helpText
    });
  } else {
    try {
      await storeUserConsent(req);
    } catch (error) {
      log.error('Can not store consent', {error});
    }
    if (req.session.hasOwnProperty('query')) {
      return res.redirect(
        `/oauth/authorize/?${Object.entries(req.session.query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      );
    }
    res.redirect('/');
  }
}

/**
 * Requests a check for existing user consent and continues the flow if it's found.
 * If no consent is found the user is redirected to the page where the consent can be made.
 *
 * @param {object} req
 * @param {function} next
 */
export async function retrieveMissingUserConsent(req, res, next) {
  const missingConsents = await shouldUserGiveConsent(req.getState(), req.getUser());
  if (missingConsents) {
    res.redirect('/consent');
  } else {
    next();
  }
}

/**
 * Check if a user has given
 *
 * A user should give consent if there are attributes in the ticket the service client requests, that the user have not
 * given consent to before.
 *
 * @param ctx
 * @returns {boolean}
 */
export async function shouldUserGiveConsent(state, user) {
  const consent = await getConsent(user.userId, state.serviceClient.clientId);
  const attributes = getConsentAttributes(state);
  return Object.keys(attributes).filter(attribute => !consent.includes(attribute)).length > 0;
}

/**
 * Stores the given consent in the storage.
 * Exported only to make testable.
 *
 * @param {object} ctx
 * @return {*}
 */
export async function storeUserConsent(ctx) {
  const userId = ctx.getUser().userId;
  const state = ctx.getState();
  const consent = getConsentAttributes(state);

  if (!userId) {
    log.error('Can not store consent without a userId');
    return false;
  }

  if (!state.serviceClient.clientId) {
    log.error('Can not store consent without a serviceClient ID');
    return false;
  }

  const hashedUserId = createHash(userId);
  const consentid = `${hashedUserId}:${state.serviceClient.clientId}`;

  addConsentToState(ctx, consent);

  await consentStore.delete(consentid);

  try {
    await consentStore.insert(consentid, {keys: Object.keys(consent)});
  } catch (e) {
    log.error('Failed saving of user consent', {
      error: e.message,
      stack: e.stack
    });
  }
}

/**
 *
 * @param ctx
 * @returns {boolean}
 */
export async function getConsent(userId, serviceClientId) {
  let consent = [];
  try {
    if (userId) {
      const hashedUserId = createHash(userId);
      const consentObject = await consentStore.read(
        `${hashedUserId}:${serviceClientId}`
      );
      consent = (consentObject && consentObject.keys) || [];
    }
  } catch (e) {
    log.error('Error while retrieving user consent', {
      error: e.message,
      stack: e.stack
    });
  }

  return consent;
}

/**
 *
 * @param ctx
 * @returns {boolean}
 */
export async function findConsents(ctx) {
  const userId = ctx.getUser().userId;
  let consents = [];
  try {
    const hashedUserId = createHash(userId);
    const consentObject = await consentStore.find(hashedUserId);
    consents =
      (consentObject &&
        consentObject
          .map(c => {
            const match = c.key.match(/(.*):(.*)/);
            return {
              consentId: c.key,
              userId: match[1],
              serviceClientId: match[2],
              consent: c.value
            };
          })
          .filter(consent => consent.userId === hashedUserId)) ||
      [];
  } catch (e) {
    log.error('Error while retrieving user consents', {
      error: e.message,
      stack: e.stack
    });
  }

  return consents;
}

/**
 *
 * @param ctx
 * @returns {boolean}
 */
export async function deleteConsents(ctx, next) {
  const consents = await findConsents(ctx);
  for (let i = 0; i < consents.length; i++) {
    const consentId = consents[i].consentId;
    try {
      await consentStore.delete(consentId);
    } catch (err) {
      log.error(`Could not delete consent with id: $${consentId}`, {
        error: err.message,
        stack: err.stack
      });
    }
  }
  next();
}

/**
 * Adds a consent object to the state object
 *
 * @param ctx
 * @param consent
 */
function addConsentToState(ctx, consent) {
  const state = ctx.getState();
  const consents = Object.assign({}, state.consents, {
    [state.serviceClient.clientId]: consent
  });
  ctx.setState({consents});
}

/**
 *
 * @param ctx
 * @returns {object}
 */
function getConsentAttributes(state) {
  const {serviceClient, ticket} = state;
  const definitionAttributes = serviceClient.attributes || {};
  const ticketAttributes = ticket.attributes || {};
  const consentAttributes = {};
  Object.keys(definitionAttributes).forEach(key => {
    if (
      attributeIsSet(ticketAttributes[key]) &&
      definitionAttributes[key].skipConsent !== true
    ) {
      consentAttributes[key] = Object.assign({}, definitionAttributes[key]);
      consentAttributes[key].key = key;
    }
  });
  return consentAttributes;
}

/**
 * Check if an attribute contains values.
 *
 * @param attribute
 * @returns {boolean}
 */
function attributeIsSet(attribute) {
  let isSet = true;
  if (attribute === null || typeof attribute === 'undefined') {
    isSet = false;
  } else if (Array.isArray(attribute) && attribute.length === 0) {
    isSet = false;
  } else if (
    typeof attribute === 'object' &&
    Object.keys(attribute).length === 0
  ) {
    isSet = false;
  }

  return isSet;
}
