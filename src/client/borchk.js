var agencyDropdown;

class LibrarySelector {
  constructor(libraries, onSelectCallback) {
    this.libraries = libraries;
    this.onSelectCallback = onSelectCallback;
    this.libraryInput = document.getElementById('libraryname-input');
    this.libraryIdInput = document.getElementById('libraryid-input');
    this.libraryGroup = document.getElementById('library-group');
    // Set clear/close var nodes
    this.toggleButton = document.getElementById(
      'libraries-dropdown-toggle-btn'
    );
    this.clearButton = document.getElementById('clear-libraries-input-btn');
    this.librariesDropdownContainer = document.getElementById(
      'libraries-dropdown-container'
    );

    this.initNavigation();
    this.currentlyVisibleAgencies = libraries;
    this.currentlySelectedIndex = -1;
    this.currentlySelectedItem = null;
    this.isOpen = false;
  }
  setButtonStatus() {
    if (this.currentSearchValue) {
      this.toggleButton.classList.add('hide');
      this.clearButton.classList.remove('hide');
    } else {
      this.toggleButton.classList.remove('hide');
      this.clearButton.classList.add('hide');
    }
  }
  open() {
    if (!this.isOpen) {
      this.librariesDropdownContainer.classList.add('visible');
      this.libraryGroup.classList.add('dropdown-visible');
      this.isOpen = true;
    }
  }
  close() {
    if (this.isOpen) {
      this.librariesDropdownContainer.classList.remove('visible');
      this.libraryGroup.classList.remove('dropdown-visible');
      this.isOpen = false;
    }
  }
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  clearLibraryInput() {
    this.currentSearchValue = '';
    this.libraryInput.value = '';
    this.libraryIdInput.value = '';
    this.filter('');
    this.libraryInput.focus();
  }
  filter(filterValue) {
    this.currentSearchValue = filterValue;
    this.setButtonStatus();
    this.currentlySelectedIndex = -1;
    this.currentlyVisibleAgencies = [];
    var query = filterValue.toLowerCase();
    for (let i = 0; i < this.libraries.length; i++) {
      const library = this.libraries[i];
      library.classList.remove('selected');
      let shouldHide =
        query &&
        library.dataset.name.toLowerCase().indexOf(query) === -1 &&
        library.dataset.aid.indexOf(query) !== 0;
      if (shouldHide) {
        library.classList.add('hide');
      } else {
        this.currentlyVisibleAgencies.push(library);
        library.classList.remove('hide');
      }
    }
  }

  // clear visible labraries
  clearVisibleLibraries() {
    this.filter();
    this.currentlyVisibleAgencies = this.libraries;
    this.currentlySelectedIndex = -1;

    for (let i = 0; i < this.libraries.length; i++) {
      const library = this.libraries[i];
      library.classList.remove('selected');
      library.classList.remove('hide');
    }
  }

  initNavigation() {
    this.libraryInput.addEventListener('focus', () => {
      this.open();
    });
    this.libraryInput.addEventListener('input', e => {
      this.currentSearchValue = e.currentTarget.value;
      this.filter(this.currentSearchValue);
    });
    this.handleKeyEvents = this.handleKeyEvents.bind(this);
    document.addEventListener('keydown', this.handleKeyEvents);
    document.addEventListener('mousedown', e => {
      if (!this.libraryGroup.contains(e.target)) {
        this.close();
      } else {
        this.open();
        if (e.target.getAttribute('data-aid')) {
          this.select(e.target);
        }
      }
    });
  }
  select(element) {
    var branchName =
      (element && element.dataset.name) || this.currentSearchValue;
    var branchId = (element && element.dataset.aid) || this.currentSearchValue;

    this.libraryIdInput.value = branchId;
    this.libraryInput.value = branchName;
    this.close();
    this.onSelectCallback();
  }
  handleKeyEvents(e) {
    if (!this.isOpen) {
      return;
    }
    var keyNames = {
      40: 'DOWN',
      38: 'UP',
      9: 'TAB',
      13: 'ENTER',
      27: 'ESC'
    };
    var key = keyNames[e.keyCode];

    if (key === 'UP') {
      e.preventDefault();
      this.navigateDropDown(-1);
    }
    if (key === 'DOWN') {
      e.preventDefault();
      this.navigateDropDown(1);
    }

    if (key === 'TAB' || key === 'ENTER') {
      e.preventDefault();
      this.select(this.currentlySelectedItem);
    }

    if (key === 'ESC') {
      this.close(e);
    }
  }

  /**
   * Navigate results in dropdown.
   *
   * @param {Number} navigationValue (+1 || -1)
   */
  navigateDropDown(navigationValue) {
    if (this.currentlySelectedItem) {
      this.currentlySelectedItem.classList.remove('selected');
    }
    this.currentlySelectedIndex += navigationValue;
    if (this.currentlySelectedIndex >= this.currentlyVisibleAgencies.length) {
      this.currentlySelectedIndex = 0;
    } else if (this.currentlySelectedIndex < 0) {
      this.currentlySelectedIndex = this.currentlyVisibleAgencies.length - 1;
    }
    this.highlightSelected(this.currentlySelectedIndex);
  }
  highlightSelected(index) {
    if (this.currentlyVisibleAgencies[index]) {
      this.currentlySelectedItem = this.currentlyVisibleAgencies[index];
      this.currentlySelectedItem.classList.add('selected');
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Set agencies
  var allAgencies = document.getElementsByClassName('agency');
  agencyDropdown = new LibrarySelector(allAgencies, () => {
    document.getElementById('userid-input').focus();
  });
});

/* eslint-disable no-unused-vars */

function dropdownTrigger() {
  agencyDropdown.open();
}
function clearLibraryInput() {
  agencyDropdown.clearLibraryInput();
}

// Toggle Field text visibility (type: password || type: tel)
// id = id of the field
function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'tel' : 'password';
  field.setAttribute('type', newType);
}

/* eslint-enable no-unused-vars */
// client form validtion
/* eslint-disable no-unused-vars */
function loginSubmit(event) {
  // if library is not preselected or predefined

  var libraryId = false;
  var libraryName = false;
  var libraryText = false;

  libraryId = document.getElementById('libraryid-input');
  libraryName = document.getElementById('libraryname-input');
  libraryText = document.getElementById('libraryname-input-text');
  resetFieldErrorMessage(libraryName, libraryText);

  // Get inputfields
  var userId = document.getElementById('userid-input');
  var pin = document.getElementById('pin-input');

  // Get input description text
  var idText = document.getElementById('userid-input-text');
  var pinText = document.getElementById('pin-input-text');

  // Reset error messages
  resetFieldErrorMessage(userId, idText);
  resetFieldErrorMessage(pin, pinText);

  // Error messages
  var noLibraryMessage = 'Du skal vælge et bibliotek';
  var noIdMessage = 'Du skal angive dit Cpr- eller lånernummer';
  var noPinMessage = 'Du skal angive din 4- eller 5-cifrede bibliotekskode';
  var invalidPinMessage = 'Bibliotekskoden skal være på 4 eller 5 cifre.';

  var valid = true;

  // if no libarary selected
  if (!libraryId.value) {
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
  if (!valid) {
    event.preventDefault();
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
