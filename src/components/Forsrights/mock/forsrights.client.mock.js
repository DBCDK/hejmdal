export async function validateNetpunktUserMock(userIdAut) {
  // for test and development
  if (userIdAut === 'invalid-user') {
    return false;
  }

  return true;
}
