/* eslint-disable max-len */

export default `<!--  edited with XMLSpy v2012 (http://www.altova.com) by DBC A/S (DBC A/S)  -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:borchk="http://oss.dbc.dk/ns/borchk" targetNamespace="http://oss.dbc.dk/ns/borchk" elementFormDefault="qualified" attributeFormDefault="unqualified">
  <xs:element name="borrowerCheckRequest">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="borchk:serviceRequester"/>
        <xs:element ref="borchk:libraryCode"/>
        <xs:element ref="borchk:userId"/>
        <xs:element ref="borchk:userPincode" minOccurs="0"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="borrowerCheckComplexRequest">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="borchk:serviceRequester"/>
        <xs:element ref="borchk:libraryCode"/>
        <xs:element ref="borchk:userId"/>
        <xs:element ref="borchk:userPincode" minOccurs="0"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="borrowerCheckResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="borchk:userId"/>
        <xs:element ref="borchk:requestStatus"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="borrowerCheckComplexResponse">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="borchk:userId"/>
        <xs:element ref="borchk:requestStatus"/>
        <xs:element ref="borchk:userPrivilege" minOccurs="0" maxOccurs="unbounded"/>
        <xs:element ref="borchk:municipalityNumber" minOccurs="0"/>
        <xs:element ref="borchk:blocked"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
  <xs:element name="blocked" type="xs:boolean"/>
  <xs:element name="libraryCode" type="xs:string">
    <xs:annotation>
      <xs:documentation xml:lang="en">libraryCode must be the specific branch of the user, and not necessarily the main library</xs:documentation>
    </xs:annotation>
  </xs:element>
  <xs:element name="municipalityNumber" type="xs:string"/>
  <xs:element name="requestStatus" type="borchk:statusType"/>
  <xs:element name="serviceRequester" type="xs:string"/>
  <xs:element name="userId" type="xs:string"/>
  <xs:element name="userPincode" type="xs:string"/>
  <xs:element name="userPrivilege" type="xs:string"/>
  <xs:simpleType name="statusType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="ok"/>
      <xs:enumeration value="service_not_licensed"/>
      <xs:enumeration value="service_unavailable"/>
      <xs:enumeration value="library_not_found"/>
      <xs:enumeration value="borrowercheck_not_allowed"/>
      <xs:enumeration value="borrower_not_found"/>
      <xs:enumeration value="borrower_not_in_municipality"/>
      <xs:enumeration value="municipality_check_not_supported_by_library"/>
      <xs:enumeration value="no_user_in_request"/>
      <xs:enumeration value="error_in_request"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;
