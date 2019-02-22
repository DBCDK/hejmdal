import {log} from '../utils/logging.util';

/**
 * Log information about all page requests.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function loggerMiddleware(req, res, next) {
  const logOnFinished = () => {
    res.removeListener('finish', logOnFinished);
    res.removeListener('close', logOnFinished);
    try {
      log.info('page request', {
        request: {
          method: req.method,
          url: req.url,
          header: req.header,
          params: req.params,
          query: req.query
        },
        response: {
          status: res.statusCode,
          message: res.statusMessage
        },
        clientId:
          req.session && req.session.client ? req.session.client.clientId : null
      });
    } catch (e) {
      log.error('parsing of request failed', {error: e, req: req});
    }
  };
  res.on('finish', logOnFinished);
  res.on('close', logOnFinished);
  next();
}
