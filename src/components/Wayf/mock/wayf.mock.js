/**
 * @file
 *
 */
const mockDataOk = {
  mail: [],
  schacPersonalUniqueID: ['urn:mace:terena.org:schac:personalUniqueID:dk:CPR:0102030405'],
  eduPersonTargetedID: ['WAYF-DK-some-long-md5-like-string'],
  groups: {
    users: [],
    members: []
  }
};

export default function getWayfMock() {
  return mockDataOk;
}
