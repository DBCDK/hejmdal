/* eslint-disable no-unused-vars */
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
/* eslint-enable no-unused-vars */

function toggleModal(modal, status = 'toggle') {
  var dimmer = document.getElementById('dimmer');
  modal = document.getElementById(modal);

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
  var modals = document.getElementsByClassName('modal');

  for (var i = 0; i < modals.length; i++) {
    var modalBody = modals[i].childNodes[1];

    // Add onScroll class if modal window is scrolled
    modalBody.addEventListener('scroll', function() {
      if (this.scrollTop > 0) {
        this.previousSibling.classList.add('onScroll');
      } else {
        this.previousSibling.classList.remove('onScroll');
      }
    });
  }

  body.addEventListener('keyup', function(e) {
    // if ESC pressed
    if (e.keyCode === 27) {
      for (var m = 0; m < modals.length; m++) {
        if (modals[m].classList.contains('visible')) {
          toggleModal(modals[m].id, 'close');
        }
      }
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
