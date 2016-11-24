/**
 * @file
 * This file provides the necessary functionality to provide a smooth user experience using the Borchk serviceprovider.
 */

document.addEventListener('DOMContentLoaded', function() {
  var libraryInput = document.getElementById('libraryid-input');
  var librariesDropdown = document.getElementById('libraries-dropdown-container');
  var allAgencies = document.getElementsByClassName('agency');
  var currentSeacrhValue = libraryInput.value;
  var currentlyVisibleAgencies = [];
  var currentlySelectedIndex = -1;

  libraryInput.addEventListener('keyup', function() {
    if (libraryInput.value !== currentSeacrhValue) {
      currentSeacrhValue = libraryInput.value;
      toggleBorchkDropdown();
      toggleVisibles();
    }
  });

  libraryInput.addEventListener('keydown', function(e) {
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
  });

  /**
   * Hides the dropdown if it's open
   *
   * @param {KeyboardEvent} e
   */
  function escapeWasPressed(e) {
    if (librariesDropdown.classList.contains('open')) {
      e.preventDefault();
      librariesDropdown.classList.remove('open');
    }
  }

  /**
   * Toggles the dropdown. If the content of the library input field contains two or more characters the droipdown will
   * be shown, otherwise it will be closed.
   */
  function toggleBorchkDropdown() {
    var display = currentSeacrhValue.length >= 2;

    if (display) {
      librariesDropdown.classList.add('open');
    }
    else {
      librariesDropdown.classList.remove('open');
    }
  }

  /**
   * Based on the value of the library input field the items in the list of agencies will be toggled hidden/shown.
   * If the given library name contains the current value of the library input field it will  be shown otherwise hidden.
   */
  function toggleVisibles() {
    currentlyVisibleAgencies = [];

    for (var i = 0; i < allAgencies.length; i++) {
      var item = allAgencies.item(i);
      item.classList.remove('selected');
      var shouldHide = !allAgencies.item(i).textContent.toLowerCase().includes(currentSeacrhValue.toLowerCase());
      item.classList.toggle('hide', shouldHide);

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
    if (!librariesDropdown.classList.contains('open')) {
      return;
    }

    if (key === 'ArrowDown') {
      if (currentlySelectedIndex >= 0) {
        currentlyVisibleAgencies[currentlySelectedIndex].classList.remove('selected');
        currentlySelectedIndex++;

        if (currentlySelectedIndex >= currentlyVisibleAgencies.length) {
          currentlySelectedIndex = 0;
        }
      }
      else {
        currentlySelectedIndex = 0;
      }
      currentlyVisibleAgencies[currentlySelectedIndex].classList.add('selected');
    }
    else if (key === 'ArrowUp') {
      if (currentlySelectedIndex >= 0) {
        currentlyVisibleAgencies[currentlySelectedIndex].classList.remove('selected');
        currentlySelectedIndex--;

        if (currentlySelectedIndex <= -1) {
          currentlySelectedIndex = currentlyVisibleAgencies.length - 1;
        }
      }
      else {
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

    if (currentlySelected && librariesDropdown.classList.contains('open')) {
      e.preventDefault();
      OnClick(currentlyVisibleAgencies[currentlySelectedIndex]);
    }
    else if (librariesDropdown.classList.contains('open')) {
      e.preventDefault();
      navigateDropDown('ArrowDown');
    }
  }
});

/**
 * Callback function for dropdown items
 *
 * @param {Node} element The element that has been clicked
 */
function OnClick(element) { // eslint-disable-line no-unused-vars
  var branchName = element.textContent;
  var branchId = element.dataset.aid;
  var libraryInput = document.getElementById('libraryid-input');
  var librariesDropdown = document.getElementById('libraries-dropdown-container');

  libraryInput.setAttribute('data-aid', branchId);
  libraryInput.value = branchName;
  librariesDropdown.classList.remove('open');
  document.getElementById('userid-input').focus();
}
