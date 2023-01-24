/**
 * @file
 */

/** Simple function to help feedback to user
 *
 * @param userId
 */
export function looksLikeAUserId(userId) {
  return userId.match(/\d/);
}
