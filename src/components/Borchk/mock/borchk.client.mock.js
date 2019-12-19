/**
 * @file
 */

const mockDataOk =
  '{"borrowerCheckResponse":{"userId":{"$":"0102030405"},"requestStatus":{"$":"ok"}},"@namespaces":null}';

const mockDataNotFound =
  '{"borrowerCheckResponse":{"userId":{"$":"0102030405"},"requestStatus":{"$":"borrower_not_found"}},"@namespaces":null}';

export default function getMockClient(agency, userId, pinCode) {
  return {
    statusCode: 200,
    body:
      agency === '710100' ||
      agency === '724000' ||
      (agency === '733000' && pinCode === '1234') ||
      pinCode === '1111'
        ? mockDataOk
        : mockDataNotFound
  };
}
