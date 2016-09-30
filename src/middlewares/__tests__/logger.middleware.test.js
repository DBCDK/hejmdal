import {expect} from 'chai';
import {LoggerMiddleware} from '../logger.middleware';


describe('LoggerMiddleware tests', () => {
  it('Should return function', () => {
    const res = LoggerMiddleware();
    expect(typeof res).to.equal('function');
  });
});
