/* eslint-disable */
/**
 * @file
 */

const mockIdpRights = {
  'default': '{"authenticated":false}',
  '790900': '{"authenticated":true,"rights":[{"productName":"INFOMEDIA","name":"READ","description":"Is allowed to read from INFORMEDIA"},{"productName":"ARTICLEFIRST","name":"READ","description":"Is allowed to read from ArticleFirst"},{"productName":"BOB","name":"READ","description":"Is allowed to read from BOB"},{"productName":"WORLDCAT","name":"READ","description":"Is allowed to read from WorldCat"},{"productName":"POSTHUS","name":"READ","description":"Is allowed to read from Posthus"},{"productName":"BIBSYS","name":"READ","description":"Is allowed to read from Bibsys"},{"productName":"LITTERATURTOLKNINGER","name":"READ","description":"Is allowed to read from Litteraturtolkninger"},{"productName":"DANBIB","name":"READ","description":"Is allowed to read from Danbib"},{"productName":"MATERIALEVURDERINGER","name":"READ","description":"Is allowed to read from Materialevurderinger"},{"productName":"VEJVISER","name":"READ","description":"Is allowed to read from VEJVISER"},{"productName":"EMNEORD","name":"READ","description":"Is allowed to read from Emneordsbasen"}]}'
};

export default function getMockClient(mock = 'default') {
  return {
    statusCode: 200,
    body: mockIdpRights[mock]
  };
}
