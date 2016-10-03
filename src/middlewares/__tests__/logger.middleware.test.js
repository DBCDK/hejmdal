import {assert} from 'chai';
import {LoggerMiddleware} from '../logger.middleware';


describe('LoggerMiddleware tests', () => {
  it('Should return function', () => {
    const res = LoggerMiddleware();
    assert.equal(res.toString(), '[object Promise]');
  });
});
