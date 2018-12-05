function onDimmerClick() {
  // close all open modals
  var modals = document.getElementsByClassName('modal');
  for (var i = 0; i < modals.length; i++) {
    modals[i].classList.remove('visible');
  }
  // close dimmer
  var dimmer = document.getElementById('dimmer');
  dimmer.classList.remove('visible');
}

function toggleModal(modal) {
  // show dimmer
  var dimmer = document.getElementById('dimmer');
  dimmer.classList.toggle('visible');
  // show specific modal
  var modal = document.getElementById(modal);
  modal.classList.toggle('visible');
}

document.addEventListener('DOMContentLoaded', function() {
  var modalBody = document.getElementById('modal-body');
  var modalHeader = document.getElementById('modal-header');

  // Add onScroll class if modal window is scrolled
  modalBody.addEventListener('scroll', function() {
    if (modalBody.scrollTop > 0) {
      modalHeader.classList.add('onScroll');
    } else {
      modalHeader.classList.remove('onScroll');
    }
  });
});
