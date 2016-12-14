/* eslint-disable */
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
  ringe: '{"findLibraryResponse":{"pickupAgency":[{"agencyName":{"$":"Midtfyns Gymnasium, Biblioteket","@":"oa"},"agencyId":{"$":"873220","@":"oa"},"agencyType":{"$":"Forskningsbibliotek","@":"oa"},"agencyEmail":{"$":"aase@mfg.dk","@":"oa"},"agencyPhone":{"$":"62 62 25 77   6","@":"oa"},"agencyFax":{"$":"62 62 15 21","@":"oa"},"agencyCvrNumber":{"$":"29553920","@":"oa"},"agencyPNumber":{"$":"1003309837","@":"oa"},"branchId":{"$":"873220","@":"oa"},"branchType":{"$":"H","@":"oa"},"branchName":[{"$":"Midtfyns Gymnasium, Biblioteket","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchPhone":{"$":"62 62 25 77","@":"oa"},"branchEmail":{"@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Holmeh\u00f8jvej 4","@":"oa"},"postalCode":{"$":"5750","@":"oa"},"city":{"$":"Ringe","@":"oa"},"isil":{"$":"DK-873220","@":"oa"},"temporarilyClosed":{"$":"1","@":"oa"},"pickupAllowed":{"$":"0","@":"oa"},"ncipLookupUser":{"$":"0","@":"oa"},"ncipRenewOrder":{"$":"0","@":"oa"},"ncipCancelOrder":{"$":"0","@":"oa"},"ncipUpdateOrder":{"$":"0","@":"oa"},"dropOffBranch":{"$":"873220","@":"oa"},"dropOffName":{"$":"Midtfyns Gymnasium, Biblioteket","@":"oa"},"lastUpdated":{"$":"2016-09-29","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"0","@":"oa"},"@":"oa"},{"agencyName":{"$":"Faaborg-Midtfyn Bibliotekerne","@":"oa"},"agencyId":{"$":"743000","@":"oa"},"agencyType":{"$":"Folkebibliotek","@":"oa"},"agencyEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"agencyPhone":{"$":"72 53 08 10","@":"oa"},"agencyFax":{"$":"72 53 08 11","@":"oa"},"agencyCvrNumber":{"$":"29188645","@":"oa"},"agencyPNumber":{"$":"1003311490","@":"oa"},"agencyEanNumber":{"$":"5798006900954","@":"oa"},"branchId":{"$":"743001","@":"oa"},"branchType":{"$":"f","@":"oa"},"branchName":[{"$":"Ringe Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Ringe Public Library","@language":{"$":"eng","@":"oa"},"@":"oa"}],"branchShortName":[{"$":"Ringe Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Ringe Library","@language":{"$":"eng","@":"oa"},"@":"oa"}],"branchPhone":{"$":"7253 0812","@":"oa"},"branchEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Algade 40","@":"oa"},"postalCode":{"$":"5750","@":"oa"},"city":{"$":"Ringe","@":"oa"},"isil":{"$":"DK-743001","@":"oa"},"branchPNumber":{"$":"1003317293","@":"oa"},"branchCatalogueUrl":{"$":"http:\/\/www.fmbib.dk","@":"oa"},"lookupUrl":{"$":"http:\/\/fmbib.dk\/forside\/postvisning?recordId=","@":"oa"},"branchWebsiteUrl":{"$":"http:\/\/www.fmbib.dk","@":"oa"},"serviceDeclarationUrl":{"$":"http:\/\/www.fmbib.dk","@":"oa"},"registrationFormUrl":{"$":"https:\/\/fmbib.dk\/side\/opret-bruger-med-nemid","@":"oa"},"registrationFormUrlText":{"$":"Opret dig som bruger med NemID","@":"oa"},"userStatusUrl":{"$":"http:\/\/www.fmbib.dk","@":"oa"},"librarydkSupportEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"librarydkSupportPhone":{"$":"7253 0810","@":"oa"},"openingHours":[{"$":"Abent Bibliotek: Alle dage 7-22. Med betjening: Mandag 10-18, Tirsdag 10-18, 0nsdag 11-18, Torsdag 10-18, Fredag 10-18, Lørdag 10-13","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Open library (Self service) Mon-Sun 7am-10pm With staff: Mon 10am-6pm, Tue 10am-6pm, Wed 11am-6pm, Thu 10am-6pm, Fri 10am-6pm, Sat 10am-1pm","@language":{"$":"eng","@":"oa"},"@":"oa"}],"temporarilyClosed":{"$":"0","@":"oa"},"illOrderReceiptText":[{"$":"Din bestilling vil blive behandlet hurtigst muligt.","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Your order has been received.","@language":{"$":"eng","@":"oa"},"@":"oa"}],"pickupAllowed":{"$":"1","@":"oa"},"ncipLookupUser":{"$":"1","@":"oa"},"ncipRenewOrder":{"$":"1","@":"oa"},"ncipCancelOrder":{"$":"1","@":"oa"},"ncipUpdateOrder":{"$":"1","@":"oa"},"ncipServerAddress":{"$":"https:\/\/oda.fynbib.dk:4002\/NCIPFAA","@":"oa"},"dropOffBranch":{"$":"743001","@":"oa"},"dropOffName":{"$":"Ringe Bibliotek","@":"oa"},"lastUpdated":{"$":"2016-09-29","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"1","@":"oa"},"geolocation":{"latitude":{"$":"55.237028","@":"oa"},"longitude":{"$":"10.4792076","@":"oa"},"@":"oa"},"@":"oa"},{"agencyName":{"$":"Ringe F\u00e6ngsel. Biblioteket","@":"oa"},"agencyId":{"$":"875920","@":"oa"},"agencyType":{"$":"Forskningsbibliotek","@":"oa"},"agencyEmail":{"$":"lmc@fmk.dk","@":"oa"},"agencyPhone":{"$":"72538164","@":"oa"},"agencyCvrNumber":{"$":"53383211","@":"oa"},"agencyPNumber":{"$":"1003394009","@":"oa"},"branchId":{"$":"875920","@":"oa"},"branchType":{"$":"H","@":"oa"},"branchName":[{"$":"Ringe F\u00e6ngsel. Biblioteket","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchPhone":{"@":"oa"},"branchEmail":{"@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"isil":{"$":"DK-875920","@":"oa"},"branchPNumber":{"$":"1003394009","@":"oa"},"temporarilyClosed":{"$":"1","@":"oa"},"pickupAllowed":{"$":"0","@":"oa"},"ncipLookupUser":{"$":"0","@":"oa"},"ncipRenewOrder":{"$":"0","@":"oa"},"ncipCancelOrder":{"$":"0","@":"oa"},"ncipUpdateOrder":{"$":"0","@":"oa"},"lastUpdated":{"$":"2016-12-05","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"0","@":"oa"},"@":"oa"}],"@":"oa"},"@namespaces":{"oa":"http:\/\/oss.dbc.dk\/ns\/openagency"}}',
  notFound: '{"findLibraryRepsonse":{}}'
};

export default function getMockClient(mock = 'notFound') {
  return {
    statusCode: 200,
    body: mockFindLibrary[mock] ? mockFindLibrary[mock] : mockFindLibrary.notFound
  };
}
