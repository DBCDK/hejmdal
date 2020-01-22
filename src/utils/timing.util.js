/**
 * @file
 * Util function for for add timing logs.
 */

/**
 * Start a timing process. Returns a function that should be called when timing is stopped.
 *
 * The returned function returns elapsed time in ms.
 *
 * @use
 *  const stopTiming = startTiming();
 *  ... // something is executed.
 *  const elapsedTime = stopTiming();
 *
 * @export
 * @returns {Function} function for getting elapsed time
 */
const {performance} = require('perf_hooks');

export default function startTiming() {
  const startHrTime = performance.now();

  return () => {
    const elapsedHrTime = performance.now();
    const elapsedTimeInMs = Math.round(elapsedHrTime - startHrTime);
    return elapsedTimeInMs;
  };
}
