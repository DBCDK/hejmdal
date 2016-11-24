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
  ringe: '{"findLibraryResponse":{"pickupAgency":[{"agencyName":{"$":"CELF. Center for Erhvervsrettede Uddannelser Lolland Falster. Biblioteket","@":"oa"},"agencyId":{"$":"831140","@":"oa"},"agencyType":{"$":"Forskningsbibliotek","@":"oa"},"agencyEmail":{"$":"merkurbib@celf.dk","@":"oa"},"agencyPhone":{"$":"54 88 89 58","@":"oa"},"agencyCvrNumber":{"$":"27328598","@":"oa"},"agencyPNumber":{"$":"1003401158","@":"oa"},"agencyEanNumber":{"$":"5798000553668","@":"oa"},"branchId":{"$":"861130","@":"oa"},"branchType":{"$":"f","@":"oa"},"branchName":[{"$":"CELF, Biblioteket Kringelborg","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchShortName":[{"$":"CELF","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchPhone":{"$":"54888888","@":"oa"},"branchEmail":{"$":"kringelborgbib@celf.dk","@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Kringelborg Allé 7","@":"oa"},"postalCode":{"$":"4800","@":"oa"},"city":{"$":"Nykøbing F.","@":"oa"},"isil":{"$":"DK-861130","@":"oa"},"branchPNumber":{"$":"1003401134","@":"oa"},"branchWebsiteUrl":{"$":"http://www.celf.dk","@":"oa"},"librarydkSupportEmail":{"$":"hsje@celf.dk","@":"oa"},"librarydkSupportPhone":{"$":"54 888 888","@":"oa"},"openingHours":[{"$":"Mandag-torsdag: 8.00-15.00Fredag: 8.00-12.30","@language":{"$":"dan","@":"oa"},"@":"oa"}],"temporarilyClosed":{"$":"0","@":"oa"},"illOrderReceiptText":[{"$":"Din bestilling vil blive behandlet senest dagen efter modtagelsen. Du vil modtage en mail, når materialet kan afhentes.","@language":{"$":"dan","@":"oa"},"@":"oa"}],"pickupAllowed":{"$":"1","@":"oa"},"ncipLookupUser":{"$":"0","@":"oa"},"ncipRenewOrder":{"$":"0","@":"oa"},"ncipCancelOrder":{"$":"0","@":"oa"},"ncipUpdateOrder":{"$":"0","@":"oa"},"dropOffBranch":{"$":"831140","@":"oa"},"dropOffName":{"$":"CELF, Biblioteket Merkur","@":"oa"},"lastUpdated":{"$":"2016-09-29","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"0","@":"oa"},"geolocation":{"latitude":{"$":"54.759583","@":"oa"},"longitude":{"$":"11.898277","@":"oa"},"@":"oa"},"@":"oa"},{"agencyName":{"$":"Midtfyns Gymnasium, Biblioteket","@":"oa"},"agencyId":{"$":"873220","@":"oa"},"agencyType":{"$":"Forskningsbibliotek","@":"oa"},"agencyEmail":{"$":"aase@mfg.dk","@":"oa"},"agencyPhone":{"$":"62 62 25 77   6","@":"oa"},"agencyFax":{"$":"62 62 15 21","@":"oa"},"agencyCvrNumber":{"$":"29553920","@":"oa"},"agencyPNumber":{"$":"1003309837","@":"oa"},"branchId":{"$":"873220","@":"oa"},"branchType":{"$":"H","@":"oa"},"branchName":[{"$":"Midtfyns Gymnasium, Biblioteket","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchPhone":{"$":"62 62 25 77","@":"oa"},"branchEmail":{"@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Holmehøjvej 4","@":"oa"},"postalCode":{"$":"5750","@":"oa"},"city":{"$":"Ringe","@":"oa"},"isil":{"$":"DK-873220","@":"oa"},"temporarilyClosed":{"$":"1","@":"oa"},"pickupAllowed":{"$":"0","@":"oa"},"ncipLookupUser":{"$":"0","@":"oa"},"ncipRenewOrder":{"$":"0","@":"oa"},"ncipCancelOrder":{"$":"0","@":"oa"},"ncipUpdateOrder":{"$":"0","@":"oa"},"dropOffBranch":{"$":"873220","@":"oa"},"dropOffName":{"$":"Midtfyns Gymnasium, Biblioteket","@":"oa"},"lastUpdated":{"$":"2016-09-29","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"0","@":"oa"},"@":"oa"},{"agencyName":{"$":"Faaborg-Midtfyn Bibliotekerne","@":"oa"},"agencyId":{"$":"743000","@":"oa"},"agencyType":{"$":"Folkebibliotek","@":"oa"},"agencyEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"agencyPhone":{"$":"72 53 08 10","@":"oa"},"agencyFax":{"$":"72 53 08 11","@":"oa"},"agencyCvrNumber":{"$":"29188645","@":"oa"},"agencyPNumber":{"$":"1003311490","@":"oa"},"agencyEanNumber":{"$":"5798006900954","@":"oa"},"branchId":{"$":"743001","@":"oa"},"branchType":{"$":"f","@":"oa"},"branchName":[{"$":"Ringe Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Ringe Public Library","@language":{"$":"eng","@":"oa"},"@":"oa"}],"branchShortName":[{"$":"Ringe Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Ringe Library","@language":{"$":"eng","@":"oa"},"@":"oa"}],"branchPhone":{"$":"7253 0812","@":"oa"},"branchEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Algade 40","@":"oa"},"postalCode":{"$":"5750","@":"oa"},"city":{"$":"Ringe","@":"oa"},"isil":{"$":"DK-743001","@":"oa"},"branchPNumber":{"$":"1003317293","@":"oa"},"branchCatalogueUrl":{"$":"http://www.fmbib.dk","@":"oa"},"lookupUrl":{"$":"http://fmbib.dk/forside/postvisning?recordId=","@":"oa"},"branchWebsiteUrl":{"$":"http://www.fmbib.dk","@":"oa"},"serviceDeclarationUrl":{"$":"http://www.fmbib.dk","@":"oa"},"registrationFormUrl":{"$":"http://portal.fynbib.dk/sites/WFMBIBF/pub/patronselfcreateinsert.html?doaction=nemlogin&data=selfcreate%3D1%20NemLogin%3DYES%20DigitalSignatur%3DNO","@":"oa"},"userStatusUrl":{"$":"http://www.fmbib.dk","@":"oa"},"librarydkSupportEmail":{"$":"bibliotek@fmk.dk","@":"oa"},"librarydkSupportPhone":{"$":"7253 0810","@":"oa"},"openingHours":[{"$":"Åbent Bibliotek: Alle dage 7-22.Med betjening:Mandag 10-18, Tirsdag 10-18, 0nsdag 11-18, Torsdag 10-18, Fredag 10-18, Lørdag 10-13","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Open library (Self service) Mon-Sun 7am-10pmWith staff: Mon 10am-6pm, Tue 10am-6pm, Wed 11am-6pm, Thu 10am-6pm, Fri 10am-6pm, Sat 10am-1pm","@language":{"$":"eng","@":"oa"},"@":"oa"}],"temporarilyClosed":{"$":"0","@":"oa"},"illOrderReceiptText":[{"$":"Din bestilling vil blive behandlet hurtigst muligt.","@language":{"$":"dan","@":"oa"},"@":"oa"},{"$":"Your order has been received.","@language":{"$":"eng","@":"oa"},"@":"oa"}],"pickupAllowed":{"$":"1","@":"oa"},"ncipLookupUser":{"$":"1","@":"oa"},"ncipRenewOrder":{"$":"1","@":"oa"},"ncipCancelOrder":{"$":"1","@":"oa"},"ncipUpdateOrder":{"$":"1","@":"oa"},"ncipServerAddress":{"$":"https://oda.fynbib.dk:4002/NCIPFAA","@":"oa"},"dropOffBranch":{"$":"743001","@":"oa"},"dropOffName":{"$":"Ringe Bibliotek","@":"oa"},"lastUpdated":{"$":"2016-09-29","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"1","@":"oa"},"geolocation":{"latitude":{"$":"55.237028","@":"oa"},"longitude":{"$":"10.4792076","@":"oa"},"@":"oa"},"@":"oa"},{"agencyName":{"$":"Guldborgsund-bibliotekerne","@":"oa"},"agencyId":{"$":"737600","@":"oa"},"agencyType":{"$":"Folkebibliotek","@":"oa"},"agencyEmail":{"$":"nyfac@guldborgsund.dk","@":"oa"},"agencyPhone":{"$":"54 73 16 00","@":"oa"},"agencyFax":{"$":"54 73 16 66","@":"oa"},"agencyCvrNumber":{"$":"29188599","@":"oa"},"agencyPNumber":{"$":"1003302546","@":"oa"},"agencyEanNumber":{"$":"5798007149727","@":"oa"},"branchId":{"$":"737604","@":"oa"},"branchType":{"$":"f","@":"oa"},"branchName":[{"$":"Stubbekøbing Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchShortName":[{"$":"Stubbekøbing Bibliotek","@language":{"$":"dan","@":"oa"},"@":"oa"}],"branchPhone":{"$":"54 73 16 75","@":"oa"},"branchEmail":{"$":"bibstub@guldborgsund.dk","@":"oa"},"branchIsAgency":{"$":"0","@":"oa"},"postalAddress":{"$":"Dosseringen 3","@":"oa"},"postalCode":{"$":"4850","@":"oa"},"city":{"$":"Stubbekøbing","@":"oa"},"isil":{"$":"DK-737604","@":"oa"},"branchPNumber":{"$":"1003305879","@":"oa"},"branchCatalogueUrl":{"$":"https://guldbib.dk","@":"oa"},"lookupUrl":{"$":"https://guldbib.dk/search/ting/","@":"oa"},"branchWebsiteUrl":{"$":"https://guldbib.dk","@":"oa"},"serviceDeclarationUrl":{"$":"https://www.gbsbib.dk/web/arena/reglement","@":"oa"},"paymentUrl":{"$":"https://www.gbsbib.dk/web/arena/protected/charges","@":"oa"},"userStatusUrl":{"$":"https://www.gbsbib.dk/web/arena/protected/loans","@":"oa"},"librarydkSupportPhone":{"$":"54 73 16 00","@":"oa"},"openingHours":[{"$":"Dagligt 07 - 22, hvis du er fyldt 15 år og oprettet som bruger i Guldborgsund-bibliotekerne.Betjente åbningstider:Mandag 14 - 18, tirsdag 10 - 14, onsdag 10 - 14, torsdag 13 - 17, fredag 12 - 16, lørdag 10 - 13","@language":{"$":"dan","@":"oa"},"@":"oa"}],"temporarilyClosed":{"$":"0","@":"oa"},"illOrderReceiptText":[{"$":"Din bestilling vil blive behandlet hurtigst muligt efter modtagelsen.","@language":{"$":"dan","@":"oa"},"@":"oa"}],"pickupAllowed":{"$":"1","@":"oa"},"ncipLookupUser":{"$":"1","@":"oa"},"ncipRenewOrder":{"$":"1","@":"oa"},"ncipCancelOrder":{"$":"1","@":"oa"},"ncipUpdateOrder":{"$":"1","@":"oa"},"ncipServerAddress":{"$":"https://cicero-fbs.com/rest/ncip/","@":"oa"},"ncipPassword":{"$":"LGJpes07??","@":"oa"},"dropOffBranch":{"$":"737600","@":"oa"},"dropOffName":{"$":"Guldborgsund. Hovedbiblioteket","@":"oa"},"lastUpdated":{"$":"2016-11-01","@":"oa"},"isOclcRsLibrary":{"$":"0","@":"oa"},"stateAndUniversityLibraryCopyService":{"$":"1","@":"oa"},"geolocation":{"latitude":{"$":"54.8913307","@":"oa"},"longitude":{"$":"12.0413789","@":"oa"},"@":"oa"},"@":"oa"}],"@":"oa"},"@namespaces":{"oa":"http://oss.dbc.dk/ns/openagency"}}',
  notFound: '{"findLibraryRepsonse":{}}'
};

export default function getMockClient(mock = 'notFound') {
  return {
    statusCode: 200,
    body: mockFindLibrary[mock] ? mockFindLibrary[mock] : mockFindLibrary.notFound
  };
}
