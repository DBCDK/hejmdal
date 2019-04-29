/**
 * @file
 * Test timing utils.
 */

import startTiming from '../timing.util';

describe('test timing', () => {
  it('should return a timing in ms', done => {
    const stopTiming = startTiming();
    expect(typeof stopTiming).toBe('function');
    setTimeout(() => {
      const elapsedTimeInMs = stopTiming();
      expect(typeof elapsedTimeInMs).toBe('number');
      expect(Math.round(elapsedTimeInMs / 1000)).toBe(1);
      done();
    }, 1000);
  });
});
