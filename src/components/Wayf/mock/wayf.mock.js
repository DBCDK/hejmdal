/**
 * @file
 *
 */
const mockDataOk = {
  mail: [],
  schacPersonalUniqueID: ['urn:mace:terena.org:schac:personalUniqueID:dk:CPR:0102030405'],
  eduPersonTargetedID: ['WAYF-DK-16028a572f83fd83cb0728aab8a6cc0685933a04'],
  groups: {
    users: [],
    members: []
  }
};

export default function getWayfMockData() {
  return mockDataOk;
}
