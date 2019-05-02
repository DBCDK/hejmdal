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
export default function startTiming() {
  const startHrTime = process.hrtime();
  return () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    return elapsedTimeInMs;
  };
}
