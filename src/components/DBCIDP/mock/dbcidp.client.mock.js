/* eslint-disable */
/**
 * @file
 */

const mockIdpRights = {
  'default': '{"authenticated":false}',
  '790900': '{"authenticated":true,"rights":[{"productName":"INFOMEDIA","name":"READ","description":"Is allowed to read from INFOMEDIA"},{"productName":"ARTICLEFIRST","name":"READ","description":"Is allowed to read from ArticleFirst"},{"productName":"BOB","name":"READ","description":"Is allowed to read from BOB"},{"productName":"WORLDCAT","name":"READ","description":"Is allowed to read from WorldCat"},{"productName":"POSTHUS","name":"READ","description":"Is allowed to read from Posthus"},{"productName":"BIBSYS","name":"READ","description":"Is allowed to read from Bibsys"},{"productName":"LITTERATURTOLKNINGER","name":"READ","description":"Is allowed to read from Litteraturtolkninger"},{"productName":"DANBIB","name":"READ","description":"Is allowed to read from Danbib"},{"productName":"MATERIALEVURDERINGER","name":"READ","description":"Is allowed to read from Materialevurderinger"},{"productName":"VEJVISER","name":"READ","description":"Is allowed to read from VEJVISER"},{"productName":"EMNEORD","name":"READ","description":"Is allowed to read from Emneordsbasen"}]}',
  '100200': '{"authenticated":true,"rights":[{"productName":"INFOMEDIA","name":"READ","description":"Is allowed to read from INFOMEDIA"},{"productName":"ARTICLEFIRST","name":"READ","description":"Is allowed to read from ArticleFirst"},{"productName":"BOB","name":"READ","description":"Is allowed to read from BOB"},{"productName":"WORLDCAT","name":"READ","description":"Is allowed to read from WorldCat"},{"productName":"POSTHUS","name":"READ","description":"Is allowed to read from Posthus"},{"productName":"BIBSYS","name":"READ","description":"Is allowed to read from Bibsys"},{"productName":"LITTERATURTOLKNINGER","name":"READ","description":"Is allowed to read from Litteraturtolkninger"},{"productName":"DANBIB","name":"READ","description":"Is allowed to read from Danbib"},{"productName":"MATERIALEVURDERINGER","name":"READ","description":"Is allowed to read from Materialevurderinger"},{"productName":"VEJVISER","name":"READ","description":"Is allowed to read from VEJVISER"},{"productName":"EMNEORD","name":"READ","description":"Is allowed to read from Emneordsbasen"}]}',
  '100300': '{"authenticated":true,"rights":[]}',
  'filmstriben': '{"organisations":[{"id":1630,"modified":"2021-06-28T12:52:44.313+02:00","created":"2021-06-28T12:52:44.313+02:00","url":"http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1630/","version":1,"agencyId":"710100","agencyName":"Hovedbiblioteket, Krystalgade"},{"id":1602,"modified":"2021-06-28T12:52:43.861+02:00","created":"2021-06-28T12:52:43.861+02:00","url":"http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1602/","version":1,"agencyId":"715100","agencyName":"Ballerup Bibliotek"}]}'
};

export default function getMockClient(mock = 'default') {
  console.log('Mock dbcidp for ', mock);
  return {
    statusCode: 200,
    body: mockIdpRights[mock]
  };
}
