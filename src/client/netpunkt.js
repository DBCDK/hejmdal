/**
 * Function to toggle password field visibility
 *
 * @param {String} id
 */
window.toggleFieldVisibility = function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'text' : 'password';
  field.setAttribute('type', newType);
};

window.changePwSubmit = function changePwSubmit(event) {
  var agencyId = document.getElementById('agencyIdChangePassword');
  var identity = document.getElementById('identityChangePassword');
  var currPass = document.getElementById('currPass');
  var newPass = document.getElementById('newPass');
  var checkPass = document.getElementById('checkPass');

  resetFieldErrorMessage(agencyId, '');
  resetFieldErrorMessage(identity, '');
  resetFieldErrorMessage(currPass, '');
  resetFieldErrorMessage(newPass, '');
  resetFieldErrorMessage(checkPass, '');

  var errorRequiredField = 'Feltet skal udfyldes';
  var errorAgencyField = 'Indtast gyldigt biblioteksnummer';
  var errorPassDiffers = 'Ny og Gentag ny adgangskode er ikke identiske';

  var valid = true;

  if (!agencyId.value) {
    addFieldErrorMessage(agencyId, errorRequiredField);
    valid = false;
  }
  if (!identity.value) {
    addFieldErrorMessage(identity, errorRequiredField);
    valid = false;
  }
  if (!currPass.value) {
    addFieldErrorMessage(currPass, errorRequiredField);
    valid = false;
  }
  if (!newPass.value) {
    addFieldErrorMessage(newPass, errorRequiredField);
    valid = false;
  }
  if (!checkPass.value) {
    addFieldErrorMessage(checkPass, errorRequiredField);
    valid = false;
  }

  if (agencyId.value && !validAgency(agencyId.value)) {
    addFieldErrorMessage(agencyId, errorAgencyField);
    valid = false;
  }

  if (newPass.value && checkPass.value && newPass.value !== checkPass.value) {
    addFieldErrorMessage(newPass, errorPassDiffers);
    addFieldErrorMessage(checkPass, errorPassDiffers);
    valid = false;
  }

  return valid;
};
/**
 * Function to validate netpunkt form fields (triggered on form submit)
 *
 * @param {event} FormSubmit
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
  var errorRequiredField = 'Feltet skal udfyldes';
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
 * @param field
 * @returns {boolean}
 */
function validAgency(agency) {
  return agency.toLowerCase().replace('dk-', '').length === 6;
}

/**
 * Function to reset form fields
 *
 * @param {field} Element
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
