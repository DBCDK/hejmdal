/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

export function getCulrAttributes(ctx, next) { // eslint-disable-line
  const userId = ctx.session.user.userId || null;
  const culrAttributes = getUserAttributesFromCulr(userId);
  ctx.session.culr = culrAttributes;
  next();
}

/**
 * Dummy method that fakes retrieval of user from CULR webservice
 *
 * @param userId
 * @return {{error: null|string, user: null|object}}
 */
function getUserAttributesFromCulr(userId) {
  const result = {
    error: null,
    user: null
  };

  if (!userId) {
    result.error = 'brugeren findes ikke';
  }
  else {
    result.culr = {
      patronid: 'abcdefghij',
      userId: userId,
      libraries: {}
    };
  }

  return result;
}
