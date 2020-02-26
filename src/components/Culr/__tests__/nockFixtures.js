import nock from 'nock';

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({
    serviceRequester: 'filmstriben',
    libraryCode: 'DK-790900',
    userId: '0102031111',
    userPincode: '1111'
  })
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'borrower_not_found'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({
    serviceRequester: 'filmstriben',
    libraryCode: 'DK-911130',
    userId: '0102031111',
    userPincode: '1111'
  })
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'borrower_not_found'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({
    serviceRequester: 'filmstriben',
    libraryCode: 'DK-710100',
    userId: '0102031111',
    userPincode: '1234'
  })
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'borrower_not_found'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({
    serviceRequester: 'filmstriben',
    libraryCode: 'DK-911116',
    userId: '0102031111',
    userPincode: '1111'
  })
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'ok'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({libraryCode: 'DK-790900', userId: '0102031111', userPincode: '1111'})
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'ok'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({libraryCode: 'DK-710100', userId: '0102031111', userPincode: '1234'})
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'ok'}
    },
    '@namespaces': null
  });

nock('http://localhost:3011', {encodedQueryParams: true})
  .get('/test/borchk')
  .query({libraryCode: 'DK-911116', userId: '0102031111', userPincode: '1111'})
  .reply(200, {
    borrowerCheckResponse: {
      userId: {$: '0102030405'},
      requestStatus: {$: 'ok'}
    },
    '@namespaces': null
  });
