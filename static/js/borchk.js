document.addEventListener('DOMContentLoaded', function() {
  var libraryInput = document.getElementById('libraryid-input');
  var librariesDropdown = document.getElementById('libraries-dropdown-container');
  var allAgencies = document.getElementsByClassName('agency');
  var currentSeacrhValue = libraryInput.value;

  libraryInput.addEventListener('keyup', function() {
    currentSeacrhValue = libraryInput.value;
    toggleBorchkDropdown();
    toggleVisibles();
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
    for (var i = 0; i < allAgencies.length; i++) {
      var item = allAgencies.item(i);
      item.classList.toggle('hide', !allAgencies.item(i).textContent.toLowerCase().includes(currentSeacrhValue.toLowerCase()));
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
