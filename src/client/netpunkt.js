const errorPassDiffers = 'Ny og Gentag ny adgangskode er ikke identiske';
const errorRequiredField = 'Feltet skal udfyldes';
const errorAgencyField = 'Indtast gyldigt biblioteksnummer';

/**
 * Function to toggle password field visibility
 *
 * @param id
 */
window.toggleFieldVisibility = function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'text' : 'password';
  field.setAttribute('type', newType);
};

/**
 *
 * @param {array} errors
 * @param {div element} errorElement
 */
window.showErrorMessages = function showErrorMessages(errors, errorElement) {
  if (errors.length) {
    errorElement.textContent = errors.join('; ');
    errorElement.style.color = 'var(--error)';
  }
  return errors.length;
};

/**
 *
 * @param {event} event
 * @returns {boolean}
 */
window.newPwSubmitStep1 = function newPwSubmitStep1(event) {
  var agencyId = document.getElementById('agencyIdNewPassword');
  var identity = document.getElementById('identityNewPassword');
  resetFieldErrorMessage(agencyId, '');
  resetFieldErrorMessage(identity, '');

  var valid = true;
  if (!agencyId.value) {
    addFieldErrorMessage(agencyId, errorRequiredField);
    valid = false;
  }
  if (!identity.value) {
    addFieldErrorMessage(identity, errorRequiredField);
    valid = false;
  }
  if (agencyId.value && !validAgency(agencyId.value)) {
    addFieldErrorMessage(agencyId, errorAgencyField);
    valid = false;
  }
  return valid;
};

/**
 *
 * @param {event} event
 * @returns {boolean}
 */
window.newPwSubmitStep2 = function newPwSubmitStep2(event) {
  var twoFactorCode = document.getElementById('twoFactorCode');
  var newPassword = document.getElementById('newPassword');
  var checkPassword = document.getElementById('checkPassword');
  resetFieldErrorMessage(twoFactorCode, '');
  resetFieldErrorMessage(newPassword, '');
  resetFieldErrorMessage(checkPassword, '');

  var valid = window.newPwSubmitStep1(event);
  if (!twoFactorCode.value) {
    addFieldErrorMessage(twoFactorCode, errorRequiredField);
    valid = false;
  }
  if (!newPassword.value) {
    addFieldErrorMessage(newPassword, errorRequiredField);
    valid = false;
  }
  if (!checkPassword.value) {
    addFieldErrorMessage(checkPassword, errorRequiredField);
    valid = false;
  }
  if (newPassword.value && checkPassword.value && newPassword.value !== checkPassword.value) {
    addFieldErrorMessage(newPassword, errorPassDiffers);
    addFieldErrorMessage(checkPassword, errorPassDiffers);
    valid = false;
  }
  return valid;
};

/**
 * Function to validate netpunkt form fields (triggered on form submit)
 *
 * @param {event} event
 */
window.netpunktSubmit = function netpunktSubmit(event) {
  // get form fields
  var userId = document.getElementById('user-input');
  var groupId = document.getElementById('group-input');
  var password = document.getElementById('pass-input');

  // Reset error messages
  resetFieldErrorMessage(userId, '');
  resetFieldErrorMessage(groupId, '');
  resetFieldErrorMessage(password, '');

  // Error messages
  var errorInvalidField = 'Indtast et gyldigt biblioteksnummer';

  // Default state
  var valid = true;

  // if no user is is set
  if (!userId.value) {
    addFieldErrorMessage(userId, errorRequiredField);
    valid = false;
  }

  // If no group id is set
  if (!groupId.value) {
    addFieldErrorMessage(groupId, errorRequiredField);
    valid = false;
  }

  if (!password.value) {
    addFieldErrorMessage(password, errorRequiredField);
    valid = false;
  }

  if (groupId.value && !validAgency(groupId.value)) {
    addFieldErrorMessage(groupId, errorInvalidField);
    valid = false;
  }

  // If errors found, do not submit form
  if (!valid) {
    event.preventDefault();
  }
};

/**
 * trimming agency in case of user has entered leading DK-
 * trimmed agency length must be 6 characters
 *
 * @param {string} agency
 * @returns {boolean}
 */
function validAgency(agency) {
  return agency.toLowerCase().replace('dk-', '').length === 6;
}

/**
 * Function to reset form fields
 *
 * @param {element} field
 */
function resetFieldErrorMessage(field) {
  if (!field) {
    return;
  }

  var text = field.parentNode.nextSibling;

  field.parentNode.classList.remove('input-inValid');
  text.classList.remove('text-inValid');
  text.innerText = '';
}

/**
 * Function to add error (and message) to field
 *
 * @param {element} field
 * @param {string} message (optional)
 */
function addFieldErrorMessage(field, message = '') {
  if (!field) {
    return;
  }

  var text = field.parentNode.nextSibling;

  field.parentNode.classList.add('input-inValid');
  text.classList.add('text-inValid');
  text.innerText = message;
}
