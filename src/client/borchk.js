/**
 * @file
 * This file provides the necessary functionality to provide a smooth user experience using the Borchk serviceprovider.
 */

var librariesDropdownContainer;
var allAgencies;
let currentlyVisibleAgencies = [];
var currentlySelectedIndex = -1;
var currentSearchValue = '';
var libraryInput;
var libraryIdInput;

// test

document.addEventListener('DOMContentLoaded', function() {
  autocompleteUsername();
  var body = document.getElementsByTagName('body')[0];
  libraryInput = document.getElementById('libraryname-input');
  libraryIdInput = document.getElementById('libraryid-input-hidden');
  currentSearchValue = libraryInput.value;

  librariesDropdownContainer = document.getElementById(
    'libraries-dropdown-container'
  );
  allAgencies = document.getElementsByClassName('agency');

  libraryInput.addEventListener('keyup', function() {
    if (libraryInput.value !== currentSearchValue) {
      currentSearchValue = libraryInput.value;
      toggleBorchkDropdown();
      toggleVisibleLibraries();
    }

    toggleInputButtons();
  });

  libraryInput.addEventListener('keydown', handleKeyDown);

  body.addEventListener('mousedown', function(e) {
    if (e.target.className.indexOf('glyphicon') !== -1) {
      return;
    }
    toggleDropdown(false);
  });

  librariesDropdownContainer.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });

  libraryInput.addEventListener('focus', toggleFocusOnLibraryNameInput);
  libraryInput.addEventListener('blur', toggleFocusOnLibraryNameInput);
  document
    .getElementById('userid-input')
    .addEventListener('focus', toggleFocusOnUserIdInput);
  document
    .getElementById('userid-input')
    .addEventListener('blur', toggleFocusOnUserIdInput);

  document
    .getElementById('pin-input')
    .addEventListener('focus', toggleFocusOnUserPinInput);
  document
    .getElementById('pin-input')
    .addEventListener('blur', toggleFocusOnUserPinInput);

  if (Storage !== undefined) {
    // eslint-disable-line no-undefined
    setRecentlySelectedLibraries();
  }
});

/**
 * Hack that catches autocompleted username and adds it to userid-input input field.
 *
 * This is needed because userid-input as default is a password field.
 */
function autocompleteUsername() {
  var catcher = document.getElementById('autocomplete-username');
  catcher.addEventListener('change', function(event) {
    document.getElementById('userid-input').value = event.currentTarget.value;
  });
}

/**
 * Toggles focus class on button's associated with libraryName input field
 */
function toggleFocusOnLibraryNameInput() {
  document
    .getElementById('libraries-dropdown-toggle-btn')
    .classList.toggle('hasfocus');
  document
    .getElementById('clear-libraries-input-btn')
    .classList.toggle('hasfocus');
}

/**
 * Toggles focus class on button's associated with userid-input field
 */
function toggleFocusOnUserIdInput() {
  document.getElementById('toggle-userid-input').classList.toggle('hasfocus');
}

/**
 * Toggles focus class on button's associated with pin-input field
 */
function toggleFocusOnUserPinInput() {
  document.getElementById('toggle-pin-input').classList.toggle('hasfocus');
}

/**
 *
 * @param {Number} keyCode
 */
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

/**
 *
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
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

/**
 * Toggles the visibility of the buttons next to the input field
 */
function toggleInputButtons() {
  var dropDownToggle = document.getElementById('libraries-dropdown-toggle-btn');
  var clearLibrariesInput = document.getElementById(
    'clear-libraries-input-btn'
  );

  if (libraryInput.value.length) {
    dropDownToggle.classList.add('hide');
    dropDownToggle.setAttribute('aria-hidden', true);

    clearLibrariesInput.classList.remove('hide');
    clearLibrariesInput.setAttribute('aria-hidden', false);
  } else {
    dropDownToggle.classList.remove('hide');
    dropDownToggle.setAttribute('aria-hidden', false);

    clearLibrariesInput.classList.add('hide');
    clearLibrariesInput.setAttribute('aria-hidden', true);
  }
}

/**
 * Clears the library input field and requests the dropdown to be closed.
 */
function clearLibraryInput() {
  // eslint-disable-line no-unused-vars
  libraryInput.value = '';
  currentSearchValue = libraryInput.value;
  toggleInputButtons();
  toggleDropdown(false);
  toggleVisibleLibraries();
  libraryInput.focus();
}

/**
 * Hides the dropdown if it's open
 *
 * @param {KeyboardEvent} e
 */
function escapeWasPressed(e) {
  if (librariesDropdownContainer.classList.contains('open')) {
    e.preventDefault();
    librariesDropdownContainer.classList.remove('open');
  }
}

/**
 * Toggles the dropdown. If the content of the library input field contains two or more characters the droipdown will
 * be shown, otherwise it will be closed.
 */
function toggleBorchkDropdown() {
  if (currentSearchValue.length >= 2) {
    toggleDropdown(true);
  } else {
    toggleDropdown(false);
  }
}

/**
 *
 * @param {string} className
 * @param {string} glyphId
 */
function toggleUserIdVisibility(className, glyphId) {
  // eslint-disable-line no-unused-vars
  var userInputField = document.getElementById(className);
  var currentType = userInputField.getAttribute('type');
  var newType = currentType === 'password' ? 'tel' : 'password';

  userInputField.setAttribute('type', newType);
  var glyph = document.getElementById(glyphId);
  glyph.classList.toggle('icon-eye-closed');
  glyph.classList.toggle('icon-eye-open');

  userInputField.focus();
}

/**
 * Toggles the libraries dropdown open/cloesd
 */
function toggleDropdown(forceOpen = null) {
  toggleLabelsInDropDown();
  if (forceOpen) {
    librariesDropdownContainer.classList.add('open');
  } else if (forceOpen === false) {
    librariesDropdownContainer.classList.remove('open');
  } else {
    librariesDropdownContainer.classList.toggle('open');
  }

  var ariaHidden = !librariesDropdownContainer.classList.contains('open');
  librariesDropdownContainer.setAttribute('aria-hidden', ariaHidden.toString());
}

function toggleLabelsInDropDown() {
  if (currentSearchValue.length >= 1) {
    document.getElementById('latest').classList.add('hide');
    document.getElementById('alphabetical').classList.add('hide');
  } else {
    document.getElementById('latest').classList.remove('hide');
    document.getElementById('alphabetical').classList.remove('hide');
  }
}

/**
 * Based on the value of the library input field the items in the list of agencies will be toggled hidden/shown.
 * If the given library name contains the current value of the library input field it will  be shown otherwise hidden.
 */
function toggleVisibleLibraries() {
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

/**
 * Based on the given string the currently highligted library in the dropdown will be set simply by adding the
 * 'selected' class.
 *
 * @param {String} key
 */
function navigateDropDown(key) {
  if (!librariesDropdownContainer.classList.contains('open')) {
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

/**
 * Selects the currently hightligted item in the dropdown list.
 *
 * @param {KeyboardEvent} e
 */
function selectHighlighted(e) {
  var currentlySelected = currentlyVisibleAgencies[currentlySelectedIndex];

  if (
    currentlySelected &&
    librariesDropdownContainer.classList.contains('open')
  ) {
    e.preventDefault();
    OnClick(currentlySelected);
  } else if (librariesDropdownContainer.classList.contains('open')) {
    e.preventDefault();
    navigateDropDown('ArrowDown');
  }
}

/**
 * Callback function for dropdown items
 *
 * @param {Node} element The element that has been clicked
 */
function OnClick(element) {
  // eslint-disable-line no-unused-vars
  var branchName = element.dataset.name;
  var branchId = element.dataset.aid;

  libraryIdInput.value = branchId;
  libraryInput.value = branchName;
  toggleDropdown(false);
  document.getElementById('userid-input').focus();
  addElementToLocalStorage({branchName, branchId});
  toggleInputButtons();
}

function addElementToLocalStorage({branchName, branchId}) {
  if (Storage === undefined) {
    // eslint-disable-line no-undefined
    return;
  }

  const storedAgencies = localStorage.getItem('agencies');
  const agencies = storedAgencies ? JSON.parse(storedAgencies) : [];
  let indexOfExistingItem = -1;
  agencies.find(function(element, index) {
    if (element.branchId === branchId) {
      indexOfExistingItem = index;
    }
  });

  if (indexOfExistingItem >= 0) {
    agencies.splice(indexOfExistingItem, 1);
  }

  agencies.splice(0, 0, {branchName, branchId});

  if (agencies.length >= 7) {
    agencies.pop();
  }

  localStorage.setItem('agencies', JSON.stringify(agencies));
  setRecentlySelectedLibraries();
}

/**
 * Manipulates the content of the dropdown. If any agencies are found in localStorage they will be rendered at the top
 * of the dropdown.
 */
function setRecentlySelectedLibraries() {
  removeExistingRecentlySelectedLibraries();
  const storedAgencies = localStorage.getItem('agencies');
  if (
    !storedAgencies ||
    !storedAgencies.length ||
    !librariesDropdownContainer
  ) {
    return;
  }

  const agencies = JSON.parse(storedAgencies);

  const latestHeader = document.getElementById('latest');
  const alphabeticalHeader = document.getElementById('alphabetical');
  const librariesDropdown = document.getElementById('libraries-dropdown');

  latestHeader.classList.remove('hide');
  alphabeticalHeader.classList.remove('hide');

  agencies.forEach(function(agency) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.classList.add('agency');
    a.classList.add('recent');
    a.setAttribute('data-aid', agency.branchId);
    a.setAttribute('data-name', agency.branchName);
    a.setAttribute('onclick', 'OnClick(this)');
    a.appendChild(document.createTextNode(agency.branchName));
    li.appendChild(a);
    librariesDropdown.insertBefore(li, alphabeticalHeader);
  });
}

function removeExistingRecentlySelectedLibraries() {
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
