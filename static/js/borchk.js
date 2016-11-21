document.addEventListener("DOMContentLoaded", function() {
  const libraryInput = document.getElementById('libraryid-input');
  const librariesDropdown = document.getElementById('libraries-dropdown-container');
  const agencies = document.agencies;
  let currentValue = libraryInput.value;

  libraryInput.addEventListener('keyup', function() {
    currentValue = libraryInput.value;
    toggleBorchkDropdown();
    renderDropdownContent();
  });

  function toggleBorchkDropdown() {
    const display = currentValue.length >= 1;

    if(display){
      librariesDropdown.classList.add('open');
    } else {
      librariesDropdown.classList.remove('open');
    }
  }

  function renderDropdownContent() {
    if(!currentValue.length){
      return;
    }

    const newContent =  agencies.filter(function(agency) {
      return agency.name.toLowerCase().includes(currentValue.toLowerCase());
    });

    console.log('newContent', newContent);
  }

  toggleBorchkDropdown();
  renderDropdownContent();
});

