import nock from 'nock';
import {CONFIG} from '../../../utils/config.util';

// Should get institutions for user
nock('https://wsibruger.uni-login.dk:443', {encodedQueryParams: true})
  .persist()
  .post(
    '/wsibruger-v4/ws',
    '\n    <S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:C="https://uni-login.dk" xmlns:A="https://wsibruger.uni-login.dk/ws">\n      <S:Header>\n      </S:Header>\n      <S:Body>\n          <A:hentBrugersInstitutionstilknytninger>\n            <C:wsBrugerid>' +
      CONFIG.unilogin.wsUser +
      '</C:wsBrugerid>\n            <C:wsPassword>' +
      CONFIG.unilogin.wsPassword +
      '</C:wsPassword>\n            <A:brugerid>valid_user_id</A:brugerid>\n          </A:hentBrugersInstitutionstilknytninger>\n      </S:Body>\n  </S:Envelope>'
  )
  .query({WSDL: ''})
  .reply(
    200,
    '<?xml version=\'1.0\' encoding=\'UTF-8\'?><S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope"><S:Body><wib:hentBrugersInstitutionstilknytningerResponse xmlns:wib="https://wsibruger.uni-login.dk/ws" xmlns:uni="https://uni-login.dk"><wib:institutionstilknytning><uni:instnr>101DBC</uni:instnr><uni:ansat><uni:rolle>Lærer</uni:rolle></uni:ansat></wib:institutionstilknytning><wib:institutionstilknytning><uni:instnr>A03132</uni:instnr><uni:ansat><uni:rolle>TAP</uni:rolle></uni:ansat></wib:institutionstilknytning></wib:hentBrugersInstitutionstilknytningerResponse></S:Body></S:Envelope>',
    [
      'Date',
      'Fri, 16 Aug 2019 11:11:12 GMT',
      'Server',
      'Apache',
      'Transfer-Encoding',
      'chunked',
      'Content-Type',
      'application/soap+xml; charset=utf-8',
      'Connection',
      'close'
    ]
  );

// Should not get institutions for user
nock('https://wsibruger.uni-login.dk:443', {encodedQueryParams: true})
  .persist()
  .post(
    '/wsibruger-v4/ws',
    '\n    <S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:C="https://uni-login.dk" xmlns:A="https://wsibruger.uni-login.dk/ws">\n      <S:Header>\n      </S:Header>\n      <S:Body>\n          <A:hentBrugersInstitutionstilknytninger>\n            <C:wsBrugerid>' +
      CONFIG.unilogin.wsUser +
      '</C:wsBrugerid>\n            <C:wsPassword>' +
      CONFIG.unilogin.wsPassword +
      '</C:wsPassword>\n            <A:brugerid>not_a_user</A:brugerid>\n          </A:hentBrugersInstitutionstilknytninger>\n      </S:Body>\n  </S:Envelope>'
  )
  .query({WSDL: ''})
  .reply(
    200,
    '<?xml version=\'1.0\' encoding=\'UTF-8\'?><S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope"><S:Body><wib:hentBrugersInstitutionstilknytningerResponse xmlns:wib="https://wsibruger.uni-login.dk/ws" xmlns:uni="https://uni-login.dk"/></S:Body></S:Envelope>',
    [
      'Date',
      'Fri, 16 Aug 2019 11:11:33 GMT',
      'Server',
      'Apache',
      'Transfer-Encoding',
      'chunked',
      'Content-Type',
      'application/soap+xml; charset=utf-8',
      'Connection',
      'close'
    ]
  );

// Should get information about institution
nock('https://wsiinst.uni-login.dk:443', {encodedQueryParams: true})
  .persist()
  .post(
    '/wsiinst-v2/ws',
    `\n    <S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope" xmlns:C="https://uni-login.dk" xmlns:A="https://wsiinst.uni-login.dk/ws">\n      <S:Header>\n      </S:Header>\n      <S:Body>\n        <A:hentInstitutioner>\n          <C:wsBrugerid>${
      CONFIG.unilogin.wsUser
    }</C:wsBrugerid>\n          <C:wsPassword>${
      CONFIG.unilogin.wsPassword
    }</C:wsPassword>\n          <A:instnr>101DBC</A:instnr><A:instnr>A03132</A:instnr>\n        </A:hentInstitutioner>\n      </S:Body>\n    </S:Envelope>`
  )
  .query({WSDL: ''})
  .reply(
    200,
    '<?xml version=\'1.0\' encoding=\'UTF-8\'?><S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope"><S:Body><wii:hentInstitutionerResponse xmlns:uni="https://uni-login.dk" xmlns:wii="https://wsiinst.uni-login.dk/ws"><wii:institution><uni:instnr>101DBC</uni:instnr><uni:instnavn>DANSK BIBLIOTEKSCENTER A/S</uni:instnavn><uni:type>A01</uni:type><uni:typenavn>Diverse</uni:typenavn><uni:adresse>Tempovej 7 - 11</uni:adresse><uni:bynavn>Ballerup</uni:bynavn><uni:postnr>2750</uni:postnr><uni:telefonnr>44867777</uni:telefonnr><uni:faxnr>44867891</uni:faxnr><uni:mailadresse>dbc@dbc.dk</uni:mailadresse></wii:institution><wii:institution><uni:instnr>A03132</uni:instnr><uni:instnavn>Vejle Bibliotekerne c/o www.pallesgavebod.dk</uni:instnavn><uni:type>C01</uni:type><uni:typenavn>Private org. &amp; firmaer</uni:typenavn><uni:adresse>Willy Sørensens Plads 1</uni:adresse><uni:bynavn>Vejle</uni:bynavn><uni:postnr>7100</uni:postnr><uni:telefonnr>40175652</uni:telefonnr><uni:kommunenr>630</uni:kommunenr><uni:kommune>Vejle Kommune</uni:kommune><uni:regionsnr>1082</uni:regionsnr><uni:region>Region Midtjylland</uni:region></wii:institution></wii:hentInstitutionerResponse></S:Body></S:Envelope>',
    [
      'Date',
      'Fri, 16 Aug 2019 10:41:47 GMT',
      'Server',
      'Apache',
      'Transfer-Encoding',
      'chunked',
      'Content-Type',
      'application/soap+xml; charset=utf-8',
      'Connection',
      'close'
    ]
  );
