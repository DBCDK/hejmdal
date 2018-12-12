// keeps the footer in the bottom if content-height is less than the window height.
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('resize', calcContentHeight);

  calcContentHeight();
});

function calcContentHeight(height) {
  // Elements wich affect content height
  var headerHeight = document.getElementById('header-container').clientHeight;
  var footerHeight = document.getElementById('footer-container').clientHeight;

  // content target
  var contentContainer = document.getElementById('content-container');

  // calculate min-heigh of content-container
  var height = window.innerHeight - (headerHeight + footerHeight);

  contentContainer.setAttribute('style', 'min-height:' + height + 'px;');
}
