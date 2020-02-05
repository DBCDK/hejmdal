import nock from 'nock';

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({
    serviceRequester: 'bibliotek.dk',
    libraryCode: 'DK-710100',
    userId: 'testId',
    userPincode: 'testPincode'
  })
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'ok'}
    },
    '@namespaces': null
  });
