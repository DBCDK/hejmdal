var storageAvailable = true;

// Library input
var libraryGroup;
var librariesDropdownContainer;
var libraryInput;
var libraryIdInput;

// Library input buttons (caret/clear)
var dropDownCaret;
var dropDownClear;

// dropdown vars
var allAgencies;
var storedAgencies = [];
var currentlyVisibleAgencies = [];
var currentlySelectedIndex = -1;
var currentSearchValue = '';

// Other form inputs
var userIdInput;

document.addEventListener('DOMContentLoaded', function() {
  // init sorage availability
  storageAvailable = Storage ? true : false;

  // Update library var nodes
  libraryGroup = document.getElementById('library-group');
  libraryInput = document.getElementById('libraryname-input');
  libraryIdInput = document.getElementById('libraryid-input');
  librariesDropdownContainer = document.getElementById(
    'libraries-dropdown-container'
  );

  // Set userId var nodes
  userIdInput = document.getElementById('userid-input');

  // Set clear/close var nodes
  dropDownCaret = document.getElementById('libraries-dropdown-toggle-btn');
  dropDownClear = document.getElementById('clear-libraries-input-btn');

  // Set agencies
  allAgencies = document.getElementsByClassName('agency');

  // Set storedAgencies
  if (storageAvailable) {
    // fetch recetnly selected libraries from localStorage
    storedAgencies = JSON.parse(localStorage.getItem('agencies')) || [];

    // Create recently selected list in dropdown
    initRecentlySelectedLibraries();
  }

  //
  // Event Listeners
  //

  // register focus in the library select inputfield
  libraryInput.addEventListener('focus', function() {
    dropdownTrigger('open');
  });

  // listen on keyevents in the library select field
  libraryInput.addEventListener('keyup', function() {
    // Other KeyPress'
    if (libraryInput.value !== currentSearchValue) {
      currentSearchValue = libraryInput.value;
      initVisibleLibraries();
    }
    initButtonStatus();
    toggleLabelsInDropDown();
  });

  // Handle dropdown navigation keys ESC | ENTER | UP | DOWN | TAB
  libraryInput.addEventListener('keydown', handleKeyEvents);

  // only for not predefined libraries
  if (librariesDropdownContainer) {
    // detect clicks outside of the dropdown - to close the dropdown
    document.addEventListener('mousedown', function(e) {
      if (librariesDropdownContainer.contains(e.target)) {
        return;
      }

      if (!e.target.classList.contains('prevent-body-close-event')) {
        if (librariesDropdownContainer.classList.contains('visible')) {
          dropdownTrigger('close');
        }
      }
    });

    // Set current search value
    currentSearchValue = libraryInput.value;

    // init
    initVisibleLibraries();
  }
});

//
// Functions
//

// triggers/toggles the dropdown
// status = 'open' || 'close' || 'toggle' (default)
function dropdownTrigger(status = 'toggle') {
  if (status === 'open') {
    librariesDropdownContainer.classList.add('visible');
    libraryGroup.classList.add('dropdown-visible');
  } else if (status === 'close') {
    librariesDropdownContainer.classList.remove('visible');
    libraryGroup.classList.remove('dropdown-visible');
  } else {
    librariesDropdownContainer.classList.toggle('visible');
    libraryGroup.classList.toggle('dropdown-visible');
  }

  toggleLabelsInDropDown();
}

// When a library in the dropdown is clicked/selected
// element = element node
function librarySelect(element) {
  // eslint-disable-line no-unused-vars
  var branchName = element.dataset.name;
  var branchId = element.dataset.aid;

  libraryIdInput.value = branchId;
  libraryInput.value = branchName;
  dropdownTrigger('close');
  userIdInput.focus();
  addLibraryToLocalStorage({branchName, branchId});
  initButtonStatus();
}

// Evaluates if the caret or the clear button (in the libraryfield) should be hidden
function initButtonStatus() {
  if (libraryInput.value.length) {
    dropDownCaret.classList.add('hide');
    dropDownClear.classList.remove('hide');
  } else {
    dropDownCaret.classList.remove('hide');
    dropDownClear.classList.add('hide');
  }
}

// Clears the library input field on clear button click
/* eslint-disable no-unused-vars */
function clearLibraryInput() {
  libraryInput.value = '';
  libraryIdInput.value = '';
  currentSearchValue = '';

  initButtonStatus();
  dropdownTrigger('close');
  clearVisibleLibraries();
}
/* eslint-enable no-unused-vars */

// Toggle Field text visibility (type: password || type: tel)
// id = id of the field
/* eslint-disable no-unused-vars */
function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'tel' : 'password';
  field.setAttribute('type', newType);
}
/* eslint-enable no-unused-vars */

// Toggle labels in dropdown
function toggleLabelsInDropDown() {
  if (currentSearchValue.length > 0) {
    document.getElementById('latest').classList.add('hide');
    document.getElementById('alphabetical').classList.add('hide');
  } else {
    if (storedAgencies.length > 0) {
      document.getElementById('latest').classList.remove('hide');
    }
    document.getElementById('alphabetical').classList.remove('hide');
  }
}

// Evaluate which libraries to be visible in the dropdown
function initVisibleLibraries() {
  currentlyVisibleAgencies = [];

  for (let i = 0; i < allAgencies.length; i++) {
    const item = allAgencies.item(i);
    item.classList.remove('selected');
    let shouldHide =
      allAgencies
        .item(i)
        .textContent.toLowerCase()
        .indexOf(currentSearchValue.toLowerCase()) === -1;
    item.classList.toggle('hide', shouldHide);

    for (let j = 0; j < currentlyVisibleAgencies.length; j++) {
      if (currentlyVisibleAgencies[j].innerText === item.innerText) {
        shouldHide = true;
        item.classList.add('hide');
      }
    }

    if (!shouldHide) {
      currentlyVisibleAgencies.push(item);
      currentlySelectedIndex = -1;
    }
  }
}

// clear visible labraries
function clearVisibleLibraries() {
  currentlyVisibleAgencies = [];
  currentlySelectedIndex = -1;

  for (let i = 0; i < allAgencies.length; i++) {
    const item = allAgencies.item(i);
    item.classList.remove('selected');
    item.classList.remove('hide');
    currentlyVisibleAgencies.push(item);
  }
}

// Creats a list with recently selected libraries in top of the dropdown
function initRecentlySelectedLibraries() {
  clearRecentlySelectedLibraries();
  if (storedAgencies.length === 0 || !librariesDropdownContainer) {
    return;
  }

  const alphabeticalHeader = document.getElementById('alphabetical');
  const librariesDropdown = document.getElementById('libraries-dropdown');

  storedAgencies.forEach(function(agency) {
    const li = document.createElement('li');
    li.classList.add('agency');
    li.classList.add('recent');
    li.setAttribute('data-aid', agency.branchId);
    li.setAttribute('data-name', agency.branchName);
    li.setAttribute('onclick', 'librarySelect(this)');
    li.appendChild(document.createTextNode(agency.branchName));
    librariesDropdown.insertBefore(li, alphabeticalHeader);
  });

  toggleLabelsInDropDown();
}

// Reset the latest selected libraries list in dropdown
function clearRecentlySelectedLibraries() {
  var elements = document.getElementsByClassName('recent');
  var lis = [];

  for (var i = 0; i < elements.length; i++) {
    var li = elements.item(i);
    lis.push(li);
  }

  lis.forEach(function(_li) {
    _li.parentNode.removeChild(_li);
  });
}

// Add library to localStorage (Recently selected list)
function addLibraryToLocalStorage({branchName, branchId}) {
  if (!storageAvailable) {
    // eslint-disable-line no-undefined
    return;
  }

  let indexOfExistingItem = -1;
  storedAgencies.find(function(element, index) {
    if (element.branchId === branchId) {
      indexOfExistingItem = index;
    }
  });

  if (indexOfExistingItem >= 0) {
    storedAgencies.splice(indexOfExistingItem, 1);
  }

  storedAgencies.splice(0, 0, {branchName, branchId});

  if (storedAgencies.length >= 7) {
    storedAgencies.pop();
  }

  localStorage.setItem('agencies', JSON.stringify(storedAgencies));
  initRecentlySelectedLibraries();
}

// Keybord events
function handleKeyEvents(e) {
  if (!e.key && e.keyCode) {
    e.key = parseKeyCode(e.keyCode);
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    navigateDropDown(e.key);
  }

  if (e.key === 'Tab' || e.key === 'Enter') {
    selectHighlighted(e);
  }

  if (e.key === 'Escape') {
    escapeWasPressed(e);
  }
}

// find keyName based on keyCode
function parseKeyCode(keyCode) {
  let key = '';

  switch (keyCode) {
    case 40:
      key = 'ArrowDown';
      break;
    case 38:
      key = 'ArrowUp';
      break;
    case 9:
      key = 'Tab';
      break;
    case 13:
      key = 'Enter';
      break;
    case 27:
      key = 'Escape';
      break;
    default:
      break;
  }

  return key;
}

// Navigate up/down in the dropdown
function navigateDropDown(key) {
  if (!librariesDropdownContainer.classList.contains('visible')) {
    return;
  }

  if (currentlyVisibleAgencies.length === 0) {
    return;
  }

  if (key === 'ArrowDown') {
    if (currentlySelectedIndex >= 0) {
      currentlyVisibleAgencies[currentlySelectedIndex].classList.remove(
        'selected'
      );
      currentlySelectedIndex++;

      if (currentlySelectedIndex >= currentlyVisibleAgencies.length) {
        currentlySelectedIndex = 0;
      }
    } else {
      currentlySelectedIndex = 0;
    }
    currentlyVisibleAgencies[currentlySelectedIndex].classList.add('selected');
  } else if (key === 'ArrowUp') {
    if (currentlySelectedIndex >= 0) {
      currentlyVisibleAgencies[currentlySelectedIndex].classList.remove(
        'selected'
      );
      currentlySelectedIndex--;

      if (currentlySelectedIndex <= -1) {
        currentlySelectedIndex = currentlyVisibleAgencies.length - 1;
      }
    } else {
      currentlySelectedIndex = currentlyVisibleAgencies.length - 1;
    }
    currentlyVisibleAgencies[currentlySelectedIndex].classList.add('selected');
  }
}

// selected the highlighted library in the dropdown
function selectHighlighted(e) {
  var currentlySelected = currentlyVisibleAgencies[currentlySelectedIndex];

  if (
    currentlySelected &&
    librariesDropdownContainer.classList.contains('visible')
  ) {
    e.preventDefault();
    librarySelect(currentlySelected);
  } else if (librariesDropdownContainer.classList.contains('visible')) {
    e.preventDefault();
    navigateDropDown('ArrowDown');
  }
}

// close dropdown on escape
function escapeWasPressed(e) {
  if (librariesDropdownContainer.classList.contains('visible')) {
    e.preventDefault();
    librariesDropdownContainer.classList.remove('visible');
  }
}

// client form validtion
/* eslint-disable no-unused-vars */
function loginSubmit() {
  // Get inputfields
  if (librariesDropdownContainer) {
    var libraryName = document.getElementById('libraryname-input');
    var libraryId = document.getElementById('libraryid-input');
  }
  var userId = document.getElementById('userid-input');
  var pin = document.getElementById('pin-input');

  // Get input description text
  var libraryText = document.getElementById('libraryname-input-text');
  var idText = document.getElementById('userid-input-text');
  var pinText = document.getElementById('pin-input-text');

  // Reset error messages
  if (librariesDropdownContainer) {
    resetFieldErrorMessage(libraryName, libraryText);
  }
  resetFieldErrorMessage(userId, idText);
  resetFieldErrorMessage(pin, pinText);

  // Error messages
  var noLibraryMessage = 'Du skal vælge et bibliotek';
  var noIdMessage = 'Du skal angive dit Cpr- eller lånernummer';
  var noPinMessage = 'Du skal angive din 4- eller 5-cifrede bibliotekskode';
  var invalidPinMessage = 'Bibliotekskoden skal være på 4 eller 5 cifre.';

  var valid = true;

  // if no libarary selected
  if (librariesDropdownContainer && !libraryId.value) {
    addFieldErrorMessage(libraryName, libraryText, noLibraryMessage);
    valid = false;
  }

  // if no userid typed
  if (!userId.value) {
    addFieldErrorMessage(userId, idText, noIdMessage);
    valid = false;
  }

  // if no pin typed
  if (!pin.value) {
    addFieldErrorMessage(pin, pinText, noPinMessage);
    valid = false;
  }

  // if pin length is not valid
  if (pin.value) {
    if (pin.value.length < 4 || pin.value.length > 5) {
      addFieldErrorMessage(pin, pinText, invalidPinMessage);
      valid = false;
    }
  }

  // if no error found, form is submit
  if (valid) {
    document.getElementById('borchk-login-form').submit();
  }
}
/* eslint-enable no-unused-vars */

// rests the form errors
function resetFieldErrorMessage(field, text) {
  field.parentNode.classList.remove('input-inValid');
  text.classList.remove('text-inValid');
  text.innerText = text.dataset.text;
}

// adds error to form inputs
function addFieldErrorMessage(field, text, message) {
  field.parentNode.classList.add('input-inValid');
  text.classList.add('text-inValid');
  text.innerText = message;
}
