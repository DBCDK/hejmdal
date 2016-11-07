/**
 * @file
 */

const mockFindLibrary = '{"findLibraryResponse":{"pickupAgency":[' +
  '{' +
  '"agencyId":{"$":"761500"},' +
  '"branchId":{"$":"761500"},' +
  '"branchName":[{"$":"Horsens Bibliotek"}],' +
  '"postalAddress":{"$":"Kongevejen 30, Endelave"},' +
  '"agencyType":{"$":"Folkebibliotek"}' +
  '},{' +
  '"agencyId":{"$":"761500"},' +
  '"branchId":{"$":"761506"},' +
  '"branchName":[{"$":"Søvind Bibliotek"}],' +
  '"postalAddress":{"$":"Ravnebjerget 12, Søvind"},' +
  '"agencyType":{"$":"Folkebibliotek"}' +
  '},{' +
  '"agencyId":{"$":"860970"},' +
  '"branchId":{"$":"860970"},' +
  '"branchName":[{"$":"Horsens Gymnasium, Biblioteket"}],' +
  '"agencyType":{"$":"Forskningsbibliotek"}' +
  '}' +
  ']}}';

const mockEmpty = '{"findLibraryRepsonse":{}}';


export default function getMockClient(mock = 'horsen?') {
  return {
    statusCode: 200,
    body: mock === 'horsen?' ? mockFindLibrary : mockEmpty
  };
}
