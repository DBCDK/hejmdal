/**
 *  keeps the footer in the bottom if content-height is less than the window height.
 * - Prevents a "flying footer"
 **/
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('resize', calcContentHeight);

  calcContentHeight();
});

function calcContentHeight() {
  // Elements wich affect content height

  var headerEl = document.getElementById('header-container') || null;
  var footerEl = document.getElementById('footer-container') || null;

  if (headerEl && footerEl) {
    var headerHeight = headerEl.clientHeight;
    var footerHeight = footerEl.clientHeight;

    // content target
    var contentContainer = document.getElementById('content-container');

    // calculate min-heigh of content-container
    var height = window.innerHeight - (headerHeight + footerHeight);

    contentContainer.setAttribute('style', 'min-height:' + height + 'px;');
  }
}
