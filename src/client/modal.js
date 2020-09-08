/* eslint-disable no-unused-vars */
window.onDimmerClick = function onDimmerClick() {
  // close all open modals + set them invisible for screen readers
  var modals = document.getElementsByClassName('modal');
  for (var i = 0; i < modals.length; i++) {
    modals[i].classList.remove('visible');
    modals[i].setAttribute('aria-hidden', 'true');
  }
  // close dimmer
  var dimmer = document.getElementById('dimmer');
  dimmer.classList.remove('visible');
};
/* eslint-enable no-unused-vars */

window.toggleModal = function toggleModal(id, status = 'toggle') {
  var dimmer = document.getElementById('dimmer');
  var modal = document.getElementById(id);

  // force open modal
  if (status === 'open') {
    // Prevent multiple modals to open (possible by tabbing)
    closeAllOpenModals();

    dimmer.classList.add('visible');
    modal.classList.add('visible');
    modal.removeAttribute('aria-hidden');
    // focus modal (fx. use of arrow keys)
    modal.getElementsByClassName('modal-body')[0].focus();
    return;
  }

  // force close modal
  if (status === 'close') {
    dimmer.classList.remove('visible');
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    return;
  }

  // if no status given, then toggle modal
  if (modal.classList.contains('visible')) {
    toggleModal(id, 'close');
  } else {
    toggleModal(id, 'open');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var body = document.getElementsByTagName('body')[0];
  var modals = document.getElementsByClassName('modal');

  for (var i = 0; i < modals.length; i++) {
    var modalBody = modals[i].childNodes[1];

    // Add onScroll class if modal window is scrolled
    modalBody.addEventListener('scroll', function () {
      if (this.scrollTop > 0) {
        this.previousSibling.classList.add('onScroll');
      } else {
        this.previousSibling.classList.remove('onScroll');
      }
    });
  }

  body.addEventListener('keyup', function (e) {
    // if ESC pressed
    if (e.keyCode === 27) {
      closeAllOpenModals();
    }

    // if ENTER pressed
    if (e.keyCode === 13) {
      // Get focused element
      const aciveElement = document.activeElement;

      // If focused element is a modal-trigger - simulate click (to open modal)
      if (aciveElement.classList.contains('modal-trigger')) {
        aciveElement.click();
      }
    }
  });
});

function closeAllOpenModals() {
  var modals = document.getElementsByClassName('modal');

  for (var m = 0; m < modals.length; m++) {
    if (modals[m].classList.contains('visible')) {
      window.toggleModal(modals[m].id, 'close');
    }
  }
}
