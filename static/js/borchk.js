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

  function toggleBorchkDropdown() {
    var display = currentSeacrhValue.length >= 2;

    if (display) {
      librariesDropdown.classList.add('open');
    }
    else {
      librariesDropdown.classList.remove('open');
    }
  }

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

  $(window).keydown(function(e) { // eslint-disable-line no-undef
    if (e.which !== 40 && e.which !== 38) {
      return;
    }

    e.preventDefault();
    if (e.which === 40) {
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
    else if (e.which === 38) {
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
  });
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