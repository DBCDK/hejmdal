import {log} from '../utils/logging.util';

export async function loggerMiddleware(ctx, res, next) {
  const logOnFinished = () => {
    res.removeListener('finish', logOnFinished);
    res.removeListener('close', logOnFinished);
    try {
      log.info('page request', {
        request: {
          method: ctx.method,
          url: ctx.url,
          header: ctx.header
        },
        response: {
          status: res.status,
          message: res.message
        }
      });
    } catch (e) {
      log.error('parsing of ctx object failed', {error: e, ctx: ctx});
    }
  };
  res.on('finish', logOnFinished);
  res.on('close', logOnFinished);
  next();
}
