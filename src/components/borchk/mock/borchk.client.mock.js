/**
 * @file
 */

const mockDataOk = '{"borrowerCheckResponse":{"userId":{"$":"1510570053"},"requestStatus":{"$":"ok"}},"@namespaces":null}';

const mockDataNotFound = '{"borrowerCheckResponse":{"userId":{"$":"1510570053"},"requestStatus":{"$":"borrower_not_found"}},"@namespaces":null}';

export default function getMockClient(library) {
  return {
    statusCode: 200,
    body: (library === '710100') ? mockDataOk : mockDataNotFound
  };
}
