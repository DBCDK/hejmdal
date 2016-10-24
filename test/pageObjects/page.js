export default class Page {
  open(path) {
    browser.url('/' + path)
  }
  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}