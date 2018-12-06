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

function toggleModal(modal, status = 'toggle') {
  var dimmer = document.getElementById('dimmer');
  var modal = document.getElementById(modal);

  // force open modal
  if (status === 'open') {
    dimmer.classList.add('visible');
    modal.classList.add('visible');
    return;
  }

  // force close modal
  if (status === 'close') {
    dimmer.classList.remove('visible');
    modal.classList.remove('visible');
    return;
  }

  // toggle modal
  dimmer.classList.toggle('visible');
  modal.classList.toggle('visible');
}

document.addEventListener('DOMContentLoaded', function() {
  var body = document.getElementsByTagName('body')[0];
  var modal = document.getElementsByClassName('modal')[0];
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

  body.addEventListener('keyup', function(e) {
    // if ESC pressed
    if (e.keyCode == 27) {
      if (modal.classList.contains('visible')) {
        toggleModal(modal.id, 'close');
      }
    }
  });
});
