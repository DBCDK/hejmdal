/**
 * @file
 * CULR compoennt handles all interaction bewteen the containing application and CULR
 */

export function getCulrAttributes(ctx, next){
  const userId = ctx.session.user.userId || null;
  const culrAttributes = getUserAttributesFromCulr(userId)
}

/**
 * Dummy method that fakes retrieval of user from CULR webservice
 *
 * @param user_id
 * @return {{error: null|string, user: null|object}}
 */
function getUserAttributesFromCulr(user_id) {
  const result = {
    error: null,
    user: null
  };

  if (!user_id) {
    result.error = 'brugeren findes ikke';
  }
  else {
    result.user = {
      patronid: 'abcdefghij',
      cpr: user_id,
      libraries: {}
    };
  }

  return result;
}
