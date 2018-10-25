import sinon from 'sinon';

import {LoggerMiddleware} from '../logger.middleware';
import {log} from '../../utils/logging.util';

describe('LoggerMiddleware tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should invoke next and make call to log.info', () => {
    const spy = sandbox.spy(log, 'info');
    const next = sandbox.mock();
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

    const res = LoggerMiddleware(ctx, next);

    return res.then(() => {
      expect(next.called).toBe(true);
      expect(spy.called).toBe(true);
      expect(spy.args[0][0]).toEqual('page request');
    });
  });

  it('Should invoke next and make call to log.error', () => {
    const spy = sandbox.spy(log, 'error');
    const next = sandbox.mock();
    const ctx = {};

    const res = LoggerMiddleware(ctx, next);

    return res.then(() => {
      expect(next.called).toBe(true);
      expect(spy.called).toBe(true);
      expect(spy.args[0][0]).toEqual('parsing of ctx object failed');
    });
  });
});
