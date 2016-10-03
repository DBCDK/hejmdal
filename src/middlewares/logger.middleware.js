import {log} from '../utils/logging';

export async function LoggerMiddleware(ctx, next) {
  await next();
  log.info('page request', {
    request: {
      method: ctx.request.method,
      url: ctx.request.url,
      header: ctx.request.header
    },
    response: {
      status: ctx.response.status,
      message: ctx.response.message
    }
  });
}
