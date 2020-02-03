// Function to toggle password field visibility
window.toggleFieldVisibility = function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'text' : 'password';
  field.setAttribute('type', newType);
};

/**
 * Function to validate netpunkt form fields (triggered on form submit)
 *
 */
//
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
  var errorInvalidField = 'Indtast et gyldigt gruppe id';

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

  if (groupId.value) {
    // trimming groupId in case of user has entered leading DK-
    const trimmedGroupId = groupId.value.toLowerCase().replace('dk-', '');
    // if trimmed groupId length is not 6 characters
    if (trimmedGroupId.length !== 6) {
      addFieldErrorMessage(groupId, errorInvalidField);
      valid = false;
    }
  }

  // If errors found, do not submit form
  if (!valid) {
    event.preventDefault();
  }
};

/**
 * Function to reset form fields
 *
 * @param {element} field
 */

// resets the form errors
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

// adds error to form inputs
function addFieldErrorMessage(field, message = '') {
  if (!field) {
    return;
  }

  var text = field.parentNode.nextSibling;

  field.parentNode.classList.add('input-inValid');
  text.classList.add('text-inValid');
  text.innerText = message;
}
