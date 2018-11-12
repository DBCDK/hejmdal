import {loggerMiddleware} from '../logger.middleware';
import {log} from '../../utils/logging.util';

describe('LoggerMiddleware tests', () => {
  it('Should invoke next and make call to log.info', () => {
    log.info = jest.fn();
    // const spy = sandbox.spy(log, 'info');
    const next = jest.fn();
    const ctx = {
      request: {
        method: 'method',
        url: 'url',
        header: 'header'
      },
      response: {
        status: 'status',
        message: 'message'
      }
    };

    const res = loggerMiddleware(ctx, ctx, next);

    return res.then(() => {
      expect(next).toBeCalled();
      expect(log.info).toBeCalledWith('page request', ctx);
    });
  });

  it('Should invoke next and make call to log.error', () => {
    log.error = jest.fn();
    const next = jest.fn();
    const ctx = {};

    const res = loggerMiddleware(ctx, ctx, next);

    return res.then(() => {
      expect(next).toBeCalled();
      expect(log.error).toBeCalledWith('parsing of ctx object failed', {
        ctx,
        error: expect.any(Error)
      });
    });
  });
});
