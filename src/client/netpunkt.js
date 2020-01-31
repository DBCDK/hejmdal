window.toggleFieldVisibility = function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'text' : 'password';
  field.setAttribute('type', newType);
};

window.netpunktSubmit = function netpunktSubmit(event) {
  // event.preventDefault();

  var userId = false;
  var groupId = false;
  var password = false;

  userId = document.getElementById('user-input');
  groupId = document.getElementById('group-input');
  password = document.getElementById('pass-input');

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

  // if pin length is not valid
  if (groupId.value) {
    const trimmedGroupId = groupId.value.toLowerCase().replace('dk-', '');

    if (trimmedGroupId.length !== 6) {
      addFieldErrorMessage(groupId, errorInvalidField);
      valid = false;
    }
  }

  // if no error found, form is submit
  if (!valid) {
    event.preventDefault();
  }
};
/* eslint-enable no-unused-vars */

// rests the form errors
function resetFieldErrorMessage(field) {
  var text = field.parentNode.nextSibling;
  if (!field) {
    return;
  }

  field.parentNode.classList.remove('input-inValid');
  text.classList.remove('text-inValid');
  text.innerText = '';
}

// adds error to form inputs
function addFieldErrorMessage(field, message) {
  var text = field.parentNode.nextSibling;

  field.parentNode.classList.add('input-inValid');
  text.classList.add('text-inValid');
  text.innerText = message;
}
