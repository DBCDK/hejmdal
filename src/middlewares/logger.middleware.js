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
      log.debug('timing', {
        service: 'Hejmdal',
        function: 'pagerequest',
        ms: elapsedTimeInMs,
        baseUrl: (req.baseUrl || '') + (req.path || '')
      });
      log.info('page request', {
        baseUrl: (req.baseUrl || '') + (req.path || ''),
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
        timings: {ms: elapsedTimeInMs}, // @TODO remove when status.dbc.dk is updated
        clientId:
          req.session && req.session.client ? req.session.client.clientId : ''
      });
    } catch (e) {
      log.error('parsing of request failed', {error: e, req: req});
    }
  };
  res.on('finish', logOnFinished);
  res.on('close', logOnFinished);
  next();
}
