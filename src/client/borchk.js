var agencyDropdown;

class LibrarySelector {
  constructor(selectorId, libraries, onSelectCallback) {
    this.wrapper = document.getElementById(selectorId);
    this.inputContainer = this.wrapper.querySelector('.input-container');
    this.libraryInput = this.wrapper.querySelector('[data-input-name]');
    this.libraryIdInput = this.wrapper.querySelector('[data-input-id]');
    this.toggleButton = this.wrapper.querySelector('[data-toggle]');
    this.clearButton = this.wrapper.querySelector('[data-clear]');
    this.mobileClearButton = this.wrapper.querySelector('[data-mobile-clear]');
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
    this.close();
  }

  filter(query) {
    this.currentlyVisibleAgencies = [];
    this.currentlySelectedIndex = -1;
    var ul = document.createElement('ul');
    if (this.types.includes('folk')) {
      var folkebiblioteker = this.filterQuery(query, this.libraries.folk);
      if (folkebiblioteker.length) {
        this.appendLibraries('Folkebiblioteker', folkebiblioteker, ul);
      }
    }
    if (this.types.includes('forsk')) {
      var forskningsbiblioteker = this.filterQuery(query, this.libraries.forsk);
      if (forskningsbiblioteker.length) {
        this.appendLibraries(
          'Forskningsbiblioteker',
          forskningsbiblioteker,
          ul
        );
      }
    }
    this.librariesDropdownContainer.innerHTML = '';
    this.librariesDropdownContainer.appendChild(ul);
    this.setButtonStatus();
  }
  filterQuery(query, libraries) {
    if (!query) {
      return libraries;
    }
    const lowerCaseQuery = query.toLowerCase();
    return libraries.filter(
      library =>
        library.name.toLowerCase().indexOf(lowerCaseQuery) >= 0 ||
        library.branchId.indexOf(query) === 0
    );
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
      this.close();
    });
    this.clearButton.addEventListener('click', () => {
      this.clearLibraryInput();
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
      } else {
        this.open();
        if (e.target.entry) {
          this.select(e.target.entry);
        }
      }
    });
  }
  select(element) {
    var branchName = (element && element.name) || this.currentSearchValue;
    var branchId = (element && element.branchId) || this.currentSearchValue;

    this.libraryIdInput.value = branchId;
    this.libraryInput.value = branchName;
    this.close();
    this.setButtonStatus();
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
      this.select(
        this.currentlySelectedItem && this.currentlySelectedItem.entry
      );
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

document.addEventListener('DOMContentLoaded', function() {
  // Set agencies
  agencyDropdown = new LibrarySelector('borchk-dropdown', window.data, () => {
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
