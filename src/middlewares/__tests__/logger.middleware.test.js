import {loggerMiddleware} from '../logger.middleware';
import {log} from '../../utils/logging.util';

describe('LoggerMiddleware tests', () => {
  const ctxListeners = {
    on: (event, cb) => {
      if (event === 'finish') {
        cb();
      }
    },
    removeListener: () => {}
  };

  it('Should invoke next and make call to log.info', () => {
    log.info = jest.fn();
    // const spy = sandbox.spy(log, 'info');
    const next = jest.fn();
    const ctx = {
      method: 'method',
      url: 'url',
      header: 'header',
      status: 'status',
      message: 'message',
      ...ctxListeners
    };

    const res = loggerMiddleware(ctx, ctx, next);

    return res.then(() => {
      expect(next).toBeCalled();
      expect(log.info).toMatchSnapshot();
    });
  });

  it('Should invoke next and make call to log.error', () => {
    log.error = jest.fn();
    const next = jest.fn();
    const ctx = {...ctxListeners};
    const res = loggerMiddleware(null, ctx, next);

    return res.then(() => {
      expect(next).toBeCalled();
      expect(log.error).toBeCalledWith('parsing of ctx object failed', {
        ctx: null,
        error: expect.any(Error)
      });
    });
  });
});
