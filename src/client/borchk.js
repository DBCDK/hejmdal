import {libMap} from './libraryNameMap';

/**
 * Instantiate a dropdown library selector.
 *
 * @class LibrarySelector
 */
class LibrarySelector {
  constructor(selectorId, libraries, onSelectCallback) {
    this.wrapper = document.getElementById(selectorId);
    this.inputContainer = this.wrapper.querySelector('.input-container');
    this.libraryInput = this.wrapper.querySelector('[data-input-name]');
    this.libraryIdInput = this.wrapper.querySelector('[data-input-id]');
    this.toggleButton = this.wrapper.querySelector('[data-toggle]');
    this.clearButton = this.wrapper.querySelector('[data-clear]');
    this.mobileClearButton = this.wrapper.querySelector('[data-mobile-clear]');
    this.mobileCloseButton = this.wrapper.querySelector('[data-mobile-close]');
    this.librariesDropdownContainer = this.wrapper.querySelector(
      '[data-dropdown-container]'
    );
    this.types = (this.wrapper.dataset.libraryTypes &&
      this.wrapper.dataset.libraryTypes.split(',')) || ['folk', 'forsk'];
    this.libraries = libraries;
    this.onSelectCallback = onSelectCallback;
    this.initNavigation();
    this.currentlyVisibleAgencies = [];
    this.currentlySelectedIndex = -1;
    this.currentlySelectedItem = null;
    this.isOpen = false;
    this.filter();
  }
  setButtonStatus() {
    if (this.currentSearchValue || this.libraryIdInput.value) {
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
      this.wrapper.classList.add('dropdown-visible');
      this.isOpen = true;
    }
  }
  close() {
    if (this.isOpen) {
      this.librariesDropdownContainer.classList.remove('visible');
      this.wrapper.classList.remove('dropdown-visible');
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
    this.setButtonStatus();
  }
  clearOnMobile() {
    this.currentSearchValue = '';
    this.libraryInput.value = '';
    this.libraryIdInput.value = '';
    this.filter('');
    this.libraryInput.focus();
    this.setButtonStatus();
  }

  filter(query) {
    this.currentlyVisibleAgencies = [];
    this.currentlySelectedIndex = query && query.length > 2 ? 0 : -1;
    var ul = document.createElement('ul');
    if (this.types.indexOf('folk') >= 0) {
      var folkebiblioteker = this.filterQuery(
        query,
        this.libraries.folk,
        'folk'
      );
      if (folkebiblioteker.length) {
        this.appendLibraries('Folkebiblioteker', folkebiblioteker, ul);
      }
    }
    if (this.types.indexOf('forsk') >= 0) {
      var forskningsbiblioteker = this.filterQuery(
        query,
        this.libraries.forsk,
        'forsk'
      );
      if (forskningsbiblioteker.length) {
        this.appendLibraries(
          'Forskningsbiblioteker',
          forskningsbiblioteker,
          ul
        );
      }
    }
    if (query && this.libraries.other.length > 0) {
      var otherLibraries = this.libraries.other.filter(
        library => library.branchId.indexOf(query) === 0
      );
      if (otherLibraries.length) {
        this.appendLibraries('Andet', otherLibraries, ul);
      }
    }

    this.librariesDropdownContainer.innerHTML = '';
    this.librariesDropdownContainer.appendChild(ul);
    this.setButtonStatus();
    this.highlightSelected(this.currentlySelectedIndex);
  }
  filterQuery(query, libraries, libIndex = 'folk') {
    if (!query) {
      return libraries;
    }
    const lowerCaseQuery = query.toLowerCase();
    return libraries.filter(library => {
      const lowerCaseLibrary = library.name.toLowerCase();
      const names = libMap[libIndex][library.branchId];
      const hasSome =
        names && names.some(v => v.toLowerCase().indexOf(lowerCaseQuery) >= 0);
      return (
        hasSome ||
        lowerCaseLibrary.indexOf(lowerCaseQuery) >= 0 ||
        library.branchId.indexOf(query) === 0
      );
    });
  }
  appendLibraries(label, libraries, ul) {
    if (label && this.types.length > 1) {
      ul.appendChild(this.createLabel(label));
    }
    for (let i = 0; i < libraries.length; i++) {
      var library = libraries[i];
      var li = this.createEntry(library);
      this.currentlyVisibleAgencies.push(li);
      ul.appendChild(li);
      ul.classList.add('libraries-dropdown');
    }
  }
  createLabel(label) {
    var li = document.createElement('li');
    li.innerHTML = label;
    li.classList.add('subject');
    return li;
  }
  createEntry(entry) {
    var li = document.createElement('li');
    li.innerHTML = entry.name;
    li.entry = entry;
    li.classList.add('agency');
    return li;
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
    this.mobileClearButton.addEventListener('click', () => {
      this.clearOnMobile();
    });
    this.mobileCloseButton.addEventListener('click', () => {
      this.close();
    });
    this.clearButton.addEventListener('click', () => {
      this.clearLibraryInput();
    });
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });
    this.libraryInput.addEventListener('focus', () => {
      this.open();
    });
    this.libraryInput.addEventListener('input', e => {
      this.currentSearchValue = e.currentTarget.value;
      this.filter(this.currentSearchValue);
    });
    this.handleKeyEvents = this.handleKeyEvents.bind(this);
    document.addEventListener('keydown', this.handleKeyEvents);
    document.addEventListener('click', e => {
      if (!this.inputContainer.contains(e.target)) {
        this.close();
      } else if (e.target.entry) {
        this.select(e.target.entry);
      }
    });
  }
  select(element) {
    var branchName = (element && element.name) || this.currentSearchValue;
    var branchId = (element && element.branchId) || this.currentSearchValue;
    var registrationUrl = (element && element.registrationUrl) || false;

    this.libraryIdInput.value = branchId;
    this.libraryInput.value = branchName;
    this.close();
    this.setButtonStatus();
    this.onSelectCallback(registrationUrl);
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
      if (this.isOpen) {
        e.preventDefault();
        this.select(
          this.currentlyVisibleAgencies[this.currentlySelectedIndex].entry
        );
      }
      this.close();
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
      this.currentlySelectedItem.scrollIntoView(false);
    }
  }
}

/* eslint-disable no-unused-vars */

document.addEventListener('DOMContentLoaded', function() {
  // Set agencies
  if (document.getElementById('borchk-dropdown')) {
    var agencyDropdown = new LibrarySelector(
      'borchk-dropdown',
      window.libraries || {},
      () => {
        document.getElementById('userid-input').focus();
      }
    );
  }
  if (document.getElementById('newUser-dropdown')) {
    var newUserAgencyDropdown = new LibrarySelector(
      'newUser-dropdown',
      window.libraries || {},
      registrationUrl => {
        if (registrationUrl) {
          window.location.href = registrationUrl;
        }
      }
    );
  }
});

// Toggle Field text visibility (type: password || type: tel)
// id = id of the field
window.toggleFieldVisibility = function toggleFieldVisibility(id) {
  var field = document.getElementById(id);
  var currentType = field.getAttribute('type');
  var newType = currentType === 'password' ? 'tel' : 'password';
  field.setAttribute('type', newType);
};

/* eslint-enable no-unused-vars */
// client form validtion
/* eslint-disable no-unused-vars */
window.loginSubmit = function loginSubmit(event) {
  // if library is not preselected or predefined

  var libraryId = false;
  var libraryName = false;
  var libraryText = false;

  libraryId = document.getElementById('libraryid-input');
  libraryName = document.querySelector('[data-js-id=libraryname-input]');
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
  var noPinMessage = 'Du skal angive din bibliotekskode';
  var invalidPinMessage = 'Bibliotekskoden skal være på mindst 4 tegn.';

  var valid = true;

  // if no library selected
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
    if (pin.value.length < 4) {
      addFieldErrorMessage(pin, pinText, invalidPinMessage);
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
function resetFieldErrorMessage(field, text) {
  if (!field || !text) {
    return;
  }
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
