/* eslint-disable max-len */
import {CONFIG} from '../../utils/config.util';

export default `<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:borchk="http://oss.dbc.dk/ns/borchk" xmlns:borchkw="http://oss.dbc.dk/ns/borchk_wsdl" targetNamespace="http://oss.dbc.dk/ns/borchk_wsdl">
<wsdl:types>
<xs:schema elementFormDefault="qualified">
<xs:import schemaLocation="http://localhost:${
  CONFIG.app.port
}/test/borchk/borchk.xsd" namespace="http://oss.dbc.dk/ns/borchk"/>
</xs:schema>
</wsdl:types>
<wsdl:message name="borrowerCheckRequest">
    <wsdl:part name="body" element="borchk:borrowerCheckRequest"/>
  </wsdl:message>
  <wsdl:message name="borrowerCheckResponse">
    <wsdl:part name="body" element="borchk:borrowerCheckResponse"/>
  </wsdl:message>
  <wsdl:message name="borrowerCheckComplexRequest">
    <wsdl:part name="body" element="borchk:borrowerCheckComplexRequest"/>
  </wsdl:message>
  <wsdl:message name="borrowerCheckComplexResponse">
    <wsdl:part name="body" element="borchk:borrowerCheckComplexResponse"/>
  </wsdl:message>
  <wsdl:portType name="borrowerCheckPortType">
    <wsdl:operation name="borrowerCheck">
      <wsdl:input message="borchkw:borrowerCheckRequest"/>
      <wsdl:output message="borchkw:borrowerCheckResponse"/>
    </wsdl:operation>
    <wsdl:operation name="borrowerCheckComplex">
      <wsdl:input message="borchkw:borrowerCheckComplexRequest"/>
      <wsdl:output message="borchkw:borrowerCheckComplexResponse"/>
    </wsdl:operation>
  </wsdl:portType>
  <wsdl:binding name="borrowerCheckBinding" type="borchkw:borrowerCheckPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="borrowerCheck">
      <soap:operation soapAction="borrowerCheck"/>
      <wsdl:input name="borrowerCheckRequest">
        <soap:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="borrowerCheckResponse">
        <soap:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="borrowerCheckComplex">
      <soap:operation soapAction="borrowerCheckComplex"/>
      <wsdl:input name="borrowerCheckComplexRequest">
        <soap:body use="literal"/>
      </wsdl:input>
      <wsdl:output name="borrowerCheckComplexResponse">
        <soap:body use="literal"/>
      </wsdl:output>
    </wsdl:operation>
  </wsdl:binding>
<wsdl:service name="borrowerCheckService">
<wsdl:port name="borrowerCheckPortType" binding="borchkw:borrowerCheckBinding">
<soap:address location="http://localhost:${CONFIG.app.port}/test/borchk"/>
</wsdl:port>
</wsdl:service>
</wsdl:definitions>`;
