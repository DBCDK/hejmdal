/**
 * @file
 */

const mockFindLibrary = {
  'horsen?': '{"findLibraryResponse":{"pickupAgency":[' +
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
  ']}}',
  '55.72-12.35': '{"findLibraryResponse":{"pickupAgency":[' +
  '{' +
  '"agencyId":{"$":"715100"},' +
  '"branchId":{"$":"715100"},' +
  '"branchName":[{"$":"Ballerup Bibliotek"}],' +
  '"postalAddress":{"$":"Hovedbiblioteket Banegårdspladsen 1"},' +
  '"agencyType":{"$":"Folkebibliotek"},' +
  '"geolocation":{' +
  '"latitude":{"$":"55.7297418"},' +
  '"longitude":{"$":"12.3595981"},' +
  '"distanceInMeter":{"$":"1237"}' +
  '}' +
  '},{' +
  '"agencyId":{"$":"724000"},' +
  '"branchId":{"$":"724000"},' +
  '"branchName":[{"$":"Smørum Bibliotek"}],' +
  '"postalAddress":{"$":"Flodvej 68 Smørumnedre"},' +
  '"agencyType":{"$":"Folkebibliotek"},' +
  '"geolocation":{' +
  '"latitude":{"$":"55.7315365"},' +
  '"longitude":{"$":"12.3083103"},' +
  '"distanceInMeter":{"$":"2905"}' +
  '}' +
  '}' +
  ']}}',
  notFound: '{"findLibraryRepsonse":{}}'
};


export default function getMockClient(mock = 'notFound') {
  return {
    statusCode: 200,
    body: mockFindLibrary[mock] ? mockFindLibrary[mock] : mockFindLibrary.notFound
  };
}
