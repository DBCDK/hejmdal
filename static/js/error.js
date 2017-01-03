/**
 * @file
 * JS functionality related to display of errors
 */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('error-overlay-close-btn')) {
    document.getElementById('error-overlay-close-btn').addEventListener('click', closeErrorOverlay);
  }

  if (document.getElementById('try-again-btn')) {
    document.getElementById('try-again-btn').addEventListener('click', closeErrorOverlay);
  }
});

/**
 * Closes the eroroverlay
 * @param {Event} e
 */
function closeErrorOverlay(e) {
  if (e) {
    e.preventDefault();
  }
  document.getElementById('topbar-container').setAttribute('aria-hidden', 'false');
  document.getElementById('content-container').setAttribute('aria-hidden', 'false');
  document.getElementById('footer-container').setAttribute('aria-hidden', 'false');
  document.getElementById('error-overlay').setAttribute('aria-hidden', 'true');
  document.getElementById('error-overlay').classList.add('hide');
}
