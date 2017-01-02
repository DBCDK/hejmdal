/**
 * @file
 */

const mockDataOk = '{"borrowerCheckResponse":{"userId":{"$":"0102030405"},"requestStatus":{"$":"ok"}},"@namespaces":null}';

const mockDataNotFound = '{"borrowerCheckResponse":{"userId":{"$":"0102030405"},"requestStatus":{"$":"borrower_not_found"}},"@namespaces":null}';

export default function getMockClient(library) {
  return {
    statusCode: 200,
    body: (library === '710100' || library === '724000') ? mockDataOk : mockDataNotFound
  };
}
