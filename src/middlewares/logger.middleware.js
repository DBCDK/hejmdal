import {log} from '../utils/logging';

export function LoggerMiddlewre() {
  return function *(next) {
    yield next;
    log.info('page request', {
      request: {
        method: this.request.method,
        url: this.request.url,
        header: this.request.header
      },
      response: {
        status: this.response.status,
        message: this.response.message,
      }
    });
  }
}
