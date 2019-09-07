import {log} from '../utils/logging.util';
import startTiming from '../utils/timing.util';

/**
 * Log information about all page requests.
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function loggerMiddleware(req, res, next) {
  const stopTiming = startTiming();
  const logOnFinished = () => {
    res.removeListener('finish', logOnFinished);
    res.removeListener('close', logOnFinished);
    try {
      const elapsedTimeInMs = stopTiming();
      log.info('page request', {
        baseUrl: req.baseUrl,
        requestObject: {
          method: req.method,
          header: req.header,
          params: req.params,
          query: req.query
        },
        responseObject: {
          status: res.statusCode,
          message: res.statusMessage
        },
        ms: elapsedTimeInMs,
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
