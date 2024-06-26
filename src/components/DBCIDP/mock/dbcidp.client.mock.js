/* eslint-disable */
/**
 * @file
 */

const mockIdpRights = {
  'default': {statusCode:200, body:'{"authenticated":false}'},
  '790900': {statusCode:200, body:'{"authenticated":true,"agencyId":"790900","identity":"idt1234","guid":"some-guid","userInfo":{"name":"User S Name","contactMail":"usersname@dbc.dk","contactPhone":"42424242"},"roles":["biblioteksadmin","biblioteksansat","NETPUNKT"],"rights":[{"productName":"INFOMEDIA","name":"READ","description":"Is allowed to read from INFOMEDIA"},{"productName":"ARTICLEFIRST","name":"READ","description":"Is allowed to read from ArticleFirst"},{"productName":"BOB","name":"READ","description":"Is allowed to read from BOB"},{"productName":"WORLDCAT","name":"READ","description":"Is allowed to read from WorldCat"},{"productName":"POSTHUS","name":"READ","description":"Is allowed to read from Posthus"},{"productName":"BIBSYS","name":"READ","description":"Is allowed to read from Bibsys"},{"productName":"LITTERATURTOLKNINGER","name":"READ","description":"Is allowed to read from Litteraturtolkninger"},{"productName":"DANBIB","name":"READ","description":"Is allowed to read from Danbib"},{"productName":"MATERIALEVURDERINGER","name":"READ","description":"Is allowed to read from Materialevurderinger"},{"productName":"VEJVISER","name":"READ","description":"Is allowed to read from VEJVISER"},{"productName":"EMNEORD","name":"READ","description":"Is allowed to read from Emneordsbasen"}]}'},
  '100200': {statusCode:200, body:'{"authenticated":true,"rights":[{"productName":"INFOMEDIA","name":"READ","description":"Is allowed to read from INFOMEDIA"},{"productName":"ARTICLEFIRST","name":"READ","description":"Is allowed to read from ArticleFirst"},{"productName":"BOB","name":"READ","description":"Is allowed to read from BOB"},{"productName":"WORLDCAT","name":"READ","description":"Is allowed to read from WorldCat"},{"productName":"POSTHUS","name":"READ","description":"Is allowed to read from Posthus"},{"productName":"BIBSYS","name":"READ","description":"Is allowed to read from Bibsys"},{"productName":"LITTERATURTOLKNINGER","name":"READ","description":"Is allowed to read from Litteraturtolkninger"},{"productName":"DANBIB","name":"READ","description":"Is allowed to read from Danbib"},{"productName":"MATERIALEVURDERINGER","name":"READ","description":"Is allowed to read from Materialevurderinger"},{"productName":"VEJVISER","name":"READ","description":"Is allowed to read from VEJVISER"},{"productName":"EMNEORD","name":"READ","description":"Is allowed to read from Emneordsbasen"}]}'},
  '100300': {statusCode:200, body:'{"authenticated":true,"rights":[]}'},
  'filmstriben': {statusCode:200, body:'{"organisations":[{"id":1630,"modified":"2021-06-28T12:52:44.313+02:00","created":"2021-06-28T12:52:44.313+02:00","url":"http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1630/","version":1,"agencyId":"710100","agencyName":"Hovedbiblioteket, Krystalgade"},{"id":1602,"modified":"2021-06-28T12:52:43.861+02:00","created":"2021-06-28T12:52:43.861+02:00","url":"http://idpservice.iscrum-prod.svc.cloud.dbc.dk/api/v1/organisation/1602/","version":1,"agencyId":"715100","agencyName":"Ballerup Bibliotek"}]}'},
  'newPassOk': {statusCode: 200, body: '{"message":"OK200"}'},
  'newPassFail': {statusCode:404, body:'{"message":"TO_SHORT"}'},
  '111111to_short': {statusCode:200, body:'{"valid": false, "message":"TOO_SHORT"}'},
  '1111112222': {statusCode:200, body:'{"valid":true}'},
};

export default function getMockClient(mock = 'default') {
  return mockIdpRights[mock] ?? '{statusCode:404, body:{"authenticated":false}}';
}
