export default `<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0">
<edmx:DataServices m:DataServiceVersion="2.0">
<Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="GWSAMPLE_BASIC" xml:lang="en" sap:schema-version="1">
<EntityType Name="BusinessPartner" sap:content-version="1">
<Key>
<PropertyRef Name="BusinessPartnerID"/>
</Key>
<Property Name="Address" Type="GWSAMPLE_BASIC.CT_Address" Nullable="false"/>
<Property Name="BusinessPartnerID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Business Partner ID" sap:creatable="false" sap:updatable="false"/>
<Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="80" sap:label="Company"/>
<Property Name="WebAddress" Type="Edm.String" sap:label="Web Address" sap:sortable="false" sap:filterable="false" sap:semantics="url"/>
<Property Name="EmailAddress" Type="Edm.String" Nullable="false" MaxLength="255" sap:label="E-Mail" sap:semantics="email"/>
<Property Name="PhoneNumber" Type="Edm.String" MaxLength="30" sap:label="Phone No." sap:semantics="tel"/>
<Property Name="FaxNumber" Type="Edm.String" MaxLength="30" sap:label="Fax Number"/>
<Property Name="LegalForm" Type="Edm.String" MaxLength="10" sap:label="Legal Form"/>
<Property Name="CurrencyCode" Type="Edm.String" Nullable="false" MaxLength="5" sap:label="Currency Code" sap:semantics="currency-code"/>
<Property Name="BusinessPartnerRole" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Bus. Part. Role"/>
<Property Name="CreatedAt" Type="Edm.DateTime" Precision="7" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<Property Name="ChangedAt" Type="Edm.DateTime" Precision="7" ConcurrencyMode="Fixed" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<NavigationProperty Name="ToSalesOrders" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_SalesOrders" FromRole="FromRole_Assoc_BusinessPartner_SalesOrders" ToRole="ToRole_Assoc_BusinessPartner_SalesOrders"/>
<NavigationProperty Name="ToContacts" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_Contacts" FromRole="FromRole_Assoc_BusinessPartner_Contacts" ToRole="ToRole_Assoc_BusinessPartner_Contacts"/>
<NavigationProperty Name="ToProducts" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_Products" FromRole="FromRole_Assoc_BusinessPartner_Products" ToRole="ToRole_Assoc_BusinessPartner_Products"/>
</EntityType>
<EntityType Name="Product" sap:content-version="1">
<Key>
<PropertyRef Name="ProductID"/>
</Key>
<Property Name="ProductID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Product ID" sap:updatable="false"/>
<Property Name="TypeCode" Type="Edm.String" Nullable="false" MaxLength="2" sap:label="Type Code"/>
<Property Name="Category" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="Category"/>
<Property Name="Name" Type="Edm.String" Nullable="false" MaxLength="255" sap:label="Product Name" sap:sortable="false" sap:filterable="false"/>
<Property Name="NameLanguage" Type="Edm.String" MaxLength="2" sap:label="Language" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Description" Type="Edm.String" MaxLength="255" sap:label="Prod.Descrip." sap:sortable="false" sap:filterable="false"/>
<Property Name="DescriptionLanguage" Type="Edm.String" MaxLength="2" sap:label="Language" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="SupplierID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Business Partner ID"/>
<Property Name="SupplierName" Type="Edm.String" MaxLength="80" sap:label="Company" sap:creatable="false" sap:updatable="false"/>
<Property Name="TaxTarifCode" Type="Edm.Byte" Nullable="false" sap:label="Tax Tariff Code"/>
<Property Name="MeasureUnit" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Unit of Measure" sap:semantics="unit-of-measure"/>
<Property Name="WeightMeasure" Type="Edm.Decimal" Precision="13" Scale="3" sap:unit="WeightUnit" sap:label="Weight"/>
<Property Name="WeightUnit" Type="Edm.String" MaxLength="3" sap:label="Unit of Measure" sap:semantics="unit-of-measure"/>
<Property Name="CurrencyCode" Type="Edm.String" Nullable="false" MaxLength="5" sap:label="Currency Code" sap:semantics="currency-code"/>
<Property Name="Price" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Price"/>
<Property Name="Width" Type="Edm.Decimal" Precision="13" Scale="3" sap:unit="DimUnit" sap:label="Dimensions"/>
<Property Name="Depth" Type="Edm.Decimal" Precision="13" Scale="3" sap:unit="DimUnit" sap:label="Dimensions"/>
<Property Name="Height" Type="Edm.Decimal" Precision="13" Scale="3" sap:unit="DimUnit" sap:label="Dimensions"/>
<Property Name="DimUnit" Type="Edm.String" MaxLength="3" sap:label="Dimension Unit" sap:semantics="unit-of-measure"/>
<Property Name="CreatedAt" Type="Edm.DateTime" Precision="7" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<Property Name="ChangedAt" Type="Edm.DateTime" Precision="7" ConcurrencyMode="Fixed" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<NavigationProperty Name="ToSalesOrderLineItems" Relationship="GWSAMPLE_BASIC.Assoc_Product_SalesOrderLineItems" FromRole="FromRole_Assoc_Product_SalesOrderLineItems" ToRole="ToRole_Assoc_Product_SalesOrderLineItems"/>
<NavigationProperty Name="ToSupplier" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_Products" FromRole="ToRole_Assoc_BusinessPartner_Products" ToRole="FromRole_Assoc_BusinessPartner_Products"/>
</EntityType>
<EntityType Name="SalesOrder" sap:content-version="1">
<Key>
<PropertyRef Name="SalesOrderID"/>
</Key>
<Property Name="SalesOrderID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Sales Order ID" sap:creatable="false" sap:updatable="false"/>
<Property Name="Note" Type="Edm.String" MaxLength="255" sap:label="Description" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="NoteLanguage" Type="Edm.String" MaxLength="2" sap:label="Language" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="CustomerID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Business Partner ID" sap:updatable="false"/>
<Property Name="CustomerName" Type="Edm.String" MaxLength="80" sap:label="Company" sap:creatable="false" sap:updatable="false"/>
<Property Name="CurrencyCode" Type="Edm.String" MaxLength="5" sap:label="Currency Code" sap:updatable="false" sap:semantics="currency-code"/>
<Property Name="GrossAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Gross Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="NetAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Net Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="TaxAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Tax Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="LifecycleStatus" Type="Edm.String" MaxLength="1" sap:label="Lifecycle Status" sap:creatable="false" sap:updatable="false"/>
<Property Name="LifecycleStatusDescription" Type="Edm.String" MaxLength="60" sap:label="Lifecycle Descript." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="BillingStatus" Type="Edm.String" MaxLength="1" sap:label="Confirmation Status" sap:creatable="false" sap:updatable="false"/>
<Property Name="BillingStatusDescription" Type="Edm.String" MaxLength="60" sap:label="Billing Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="DeliveryStatus" Type="Edm.String" MaxLength="1" sap:label="Ordering Status" sap:creatable="false" sap:updatable="false"/>
<Property Name="DeliveryStatusDescription" Type="Edm.String" MaxLength="60" sap:label="Delivery Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="CreatedAt" Type="Edm.DateTime" Precision="7" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<Property Name="ChangedAt" Type="Edm.DateTime" Precision="7" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false"/>
<NavigationProperty Name="ToBusinessPartner" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_SalesOrders" FromRole="ToRole_Assoc_BusinessPartner_SalesOrders" ToRole="FromRole_Assoc_BusinessPartner_SalesOrders"/>
<NavigationProperty Name="ToLineItems" Relationship="GWSAMPLE_BASIC.Assoc_SalesOrder_SalesOrderLineItems" FromRole="FromRole_Assoc_SalesOrder_SalesOrderLineItems" ToRole="ToRole_Assoc_SalesOrder_SalesOrderLineItems"/>
</EntityType>
<EntityType Name="SalesOrderLineItem" sap:content-version="1">
<Key>
<PropertyRef Name="SalesOrderID"/>
<PropertyRef Name="ItemPosition"/>
</Key>
<Property Name="SalesOrderID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Sales Order ID" sap:updatable="false"/>
<Property Name="ItemPosition" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Item Position" sap:creatable="false" sap:updatable="false"/>
<Property Name="ProductID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Product ID"/>
<Property Name="Note" Type="Edm.String" MaxLength="255" sap:label="Description" sap:sortable="false" sap:filterable="false"/>
<Property Name="NoteLanguage" Type="Edm.String" MaxLength="2" sap:label="Language" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="CurrencyCode" Type="Edm.String" MaxLength="5" sap:label="Currency Code" sap:creatable="false" sap:updatable="false" sap:semantics="currency-code"/>
<Property Name="GrossAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Gross Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="NetAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Net Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="TaxAmount" Type="Edm.Decimal" Precision="16" Scale="3" sap:unit="CurrencyCode" sap:label="Tax Amount" sap:creatable="false" sap:updatable="false"/>
<Property Name="DeliveryDate" Type="Edm.DateTime" Nullable="false" Precision="7" sap:label="Time Stamp" sap:sortable="false" sap:filterable="false"/>
<Property Name="Quantity" Type="Edm.Decimal" Nullable="false" Precision="13" Scale="3" sap:unit="QuantityUnit" sap:label="Quantity" sap:sortable="false" sap:filterable="false"/>
<Property Name="QuantityUnit" Type="Edm.String" MaxLength="3" sap:label="Unit of Measure" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="unit-of-measure"/>
<NavigationProperty Name="ToHeader" Relationship="GWSAMPLE_BASIC.Assoc_SalesOrder_SalesOrderLineItems" FromRole="ToRole_Assoc_SalesOrder_SalesOrderLineItems" ToRole="FromRole_Assoc_SalesOrder_SalesOrderLineItems"/>
<NavigationProperty Name="ToProduct" Relationship="GWSAMPLE_BASIC.Assoc_Product_SalesOrderLineItems" FromRole="ToRole_Assoc_Product_SalesOrderLineItems" ToRole="FromRole_Assoc_Product_SalesOrderLineItems"/>
</EntityType>
<EntityType Name="Contact" sap:content-version="1">
<Key>
<PropertyRef Name="ContactGuid"/>
</Key>
<Property Name="Address" Type="GWSAMPLE_BASIC.CT_Address" Nullable="false"/>
<Property Name="ContactGuid" Type="Edm.Guid" Nullable="false" sap:label="Contact GUID" sap:creatable="false" sap:updatable="false"/>
<Property Name="BusinessPartnerID" Type="Edm.String" Nullable="false" MaxLength="10" sap:label="Business Partner ID" sap:updatable="false"/>
<Property Name="Title" Type="Edm.String" MaxLength="10" sap:label="Title"/>
<Property Name="FirstName" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="First Name" sap:semantics="givenname"/>
<Property Name="MiddleName" Type="Edm.String" MaxLength="40" sap:label="Middle Name" sap:semantics="middlename"/>
<Property Name="LastName" Type="Edm.String" MaxLength="40" sap:label="Last Name" sap:semantics="familyname"/>
<Property Name="Nickname" Type="Edm.String" MaxLength="40" sap:label="Nickname" sap:semantics="nickname"/>
<Property Name="Initials" Type="Edm.String" MaxLength="10" sap:label="Initials"/>
<Property Name="Sex" Type="Edm.String" Nullable="false" MaxLength="1" sap:label="Gender"/>
<Property Name="PhoneNumber" Type="Edm.String" MaxLength="30" sap:label="Phone No." sap:semantics="tel"/>
<Property Name="FaxNumber" Type="Edm.String" MaxLength="30" sap:label="Fax Number"/>
<Property Name="EmailAddress" Type="Edm.String" MaxLength="255" sap:label="E-Mail" sap:semantics="email"/>
<Property Name="Language" Type="Edm.String" MaxLength="2" sap:label="Language Key"/>
<Property Name="DateOfBirth" Type="Edm.DateTime" Precision="7" sap:label="Date of Birth" sap:semantics="bday"/>
<NavigationProperty Name="ToBusinessPartner" Relationship="GWSAMPLE_BASIC.Assoc_BusinessPartner_Contacts" FromRole="ToRole_Assoc_BusinessPartner_Contacts" ToRole="FromRole_Assoc_BusinessPartner_Contacts"/>
</EntityType>
<EntityType Name="VH_Sex" sap:content-version="1">
<Key>
<PropertyRef Name="Sex"/>
</Key>
<Property Name="Sex" Type="Edm.String" Nullable="false" MaxLength="1" sap:label="Sex" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Shorttext" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Short Descript." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_Country" sap:content-version="1">
<Key>
<PropertyRef Name="Land1"/>
</Key>
<Property Name="Land1" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Country" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Landx" Type="Edm.String" Nullable="false" MaxLength="15" sap:label="Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Natio" Type="Edm.String" Nullable="false" MaxLength="15" sap:label="Nationality" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_AddressType" sap:content-version="1">
<Key>
<PropertyRef Name="AddressType"/>
</Key>
<Property Name="AddressType" Type="Edm.String" Nullable="false" MaxLength="2" sap:label="Address Type" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Shorttext" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Short Descript." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_Category" sap:content-version="1">
<Key>
<PropertyRef Name="Category"/>
</Key>
<Property Name="Category" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="Prod. Cat." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_Currency" sap:content-version="1">
<Key>
<PropertyRef Name="Waers"/>
</Key>
<Property Name="Waers" Type="Edm.String" Nullable="false" MaxLength="5" sap:label="Currency" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="currency-code"/>
<Property Name="Ltext" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="Long Text" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_UnitQuantity" sap:content-version="1">
<Key>
<PropertyRef Name="Msehi"/>
</Key>
<Property Name="Msehi" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Int. meas. unit" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="unit-of-measure"/>
<Property Name="Msehl" Type="Edm.String" Nullable="false" MaxLength="30" sap:label="Unit text" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_UnitWeight" sap:content-version="1">
<Key>
<PropertyRef Name="Msehi"/>
</Key>
<Property Name="Msehi" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Int. meas. unit" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="unit-of-measure"/>
<Property Name="Msehl" Type="Edm.String" Nullable="false" MaxLength="30" sap:label="Unit text" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_UnitLength" sap:content-version="1">
<Key>
<PropertyRef Name="Msehi"/>
</Key>
<Property Name="Msehi" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Int. meas. unit" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false" sap:semantics="unit-of-measure"/>
<Property Name="Msehl" Type="Edm.String" Nullable="false" MaxLength="30" sap:label="Unit text" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_ProductTypeCode" sap:content-version="1">
<Key>
<PropertyRef Name="TypeCode"/>
</Key>
<Property Name="TypeCode" Type="Edm.String" Nullable="false" MaxLength="2" sap:label="Prod. Type Code" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Shorttext" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Short Descript." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_BPRole" sap:content-version="1">
<Key>
<PropertyRef Name="BpRole"/>
</Key>
<Property Name="BpRole" Type="Edm.String" Nullable="false" MaxLength="3" sap:label="Bus. Part. Role" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Shorttext" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Short Descript." sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<EntityType Name="VH_Language" sap:content-version="1">
<Key>
<PropertyRef Name="Spras"/>
</Key>
<Property Name="Spras" Type="Edm.String" Nullable="false" MaxLength="2" sap:label="Language" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
<Property Name="Sptxt" Type="Edm.String" Nullable="false" MaxLength="16" sap:label="Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</EntityType>
<ComplexType Name="CT_Address">
<Property Name="City" Type="Edm.String" MaxLength="40" sap:label="City" sap:semantics="city"/>
<Property Name="PostalCode" Type="Edm.String" MaxLength="10" sap:label="Postal Code" sap:semantics="zip"/>
<Property Name="Street" Type="Edm.String" MaxLength="60" sap:label="Street" sap:semantics="street"/>
<Property Name="Building" Type="Edm.String" MaxLength="10" sap:label="Building"/>
<Property Name="Country" Type="Edm.String" MaxLength="3" sap:label="Country" sap:semantics="country"/>
<Property Name="AddressType" Type="Edm.String" MaxLength="2" sap:label="Address Type"/>
</ComplexType>
<ComplexType Name="CT_String">
<Property Name="String" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/>
</ComplexType>
<Association Name="Assoc_VH_Country_Contacts" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Country" Multiplicity="1" Role="FromRole_Assoc_VH_Country_Contacts"/>
<End Type="GWSAMPLE_BASIC.Contact" Multiplicity="*" Role="ToRole_Assoc_VH_Country_Contacts"/>
</Association>
<Association Name="Assoc_VH_Country_BusinessPartners" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Country" Multiplicity="1" Role="FromRole_Assoc_VH_Country_BusinessPartners"/>
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="*" Role="ToRole_Assoc_VH_Country_BusinessPartners"/>
</Association>
<Association Name="Assoc_VH_UnitQuantity_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_UnitQuantity" Multiplicity="1" Role="FromRole_Assoc_VH_UnitQuantity_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_UnitQuantity_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_UnitQuantity_Products">
<PropertyRef Name="Msehi"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_UnitQuantity_Products">
<PropertyRef Name="MeasureUnit"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_UnitQuantity_SalesOrderLineItem" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_UnitQuantity" Multiplicity="1" Role="FromRole_Assoc_VH_UnitQuantity_SalesOrderLineItem"/>
<End Type="GWSAMPLE_BASIC.SalesOrderLineItem" Multiplicity="*" Role="ToRole_Assoc_VH_UnitQuantity_SalesOrderLineItem"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_UnitQuantity_SalesOrderLineItem">
<PropertyRef Name="Msehi"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_UnitQuantity_SalesOrderLineItem">
<PropertyRef Name="QuantityUnit"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_BusinessPartner_Contacts" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="1" Role="FromRole_Assoc_BusinessPartner_Contacts"/>
<End Type="GWSAMPLE_BASIC.Contact" Multiplicity="*" Role="ToRole_Assoc_BusinessPartner_Contacts"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_BusinessPartner_Contacts">
<PropertyRef Name="BusinessPartnerID"/>
</Principal>
<Dependent Role="ToRole_Assoc_BusinessPartner_Contacts">
<PropertyRef Name="BusinessPartnerID"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_BusinessPartner_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="1" Role="FromRole_Assoc_BusinessPartner_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_BusinessPartner_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_BusinessPartner_Products">
<PropertyRef Name="BusinessPartnerID"/>
</Principal>
<Dependent Role="ToRole_Assoc_BusinessPartner_Products">
<PropertyRef Name="SupplierID"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_BusinessPartner_SalesOrders" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="1" Role="FromRole_Assoc_BusinessPartner_SalesOrders"/>
<End Type="GWSAMPLE_BASIC.SalesOrder" Multiplicity="*" Role="ToRole_Assoc_BusinessPartner_SalesOrders"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_BusinessPartner_SalesOrders">
<PropertyRef Name="BusinessPartnerID"/>
</Principal>
<Dependent Role="ToRole_Assoc_BusinessPartner_SalesOrders">
<PropertyRef Name="CustomerID"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_UnitWeight_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_UnitWeight" Multiplicity="1" Role="FromRole_Assoc_VH_UnitWeight_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_UnitWeight_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_UnitWeight_Products">
<PropertyRef Name="Msehi"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_UnitWeight_Products">
<PropertyRef Name="WeightUnit"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_SalesOrder_SalesOrderLineItems" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.SalesOrder" Multiplicity="1" Role="FromRole_Assoc_SalesOrder_SalesOrderLineItems"/>
<End Type="GWSAMPLE_BASIC.SalesOrderLineItem" Multiplicity="*" Role="ToRole_Assoc_SalesOrder_SalesOrderLineItems"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_SalesOrder_SalesOrderLineItems">
<PropertyRef Name="SalesOrderID"/>
</Principal>
<Dependent Role="ToRole_Assoc_SalesOrder_SalesOrderLineItems">
<PropertyRef Name="SalesOrderID"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Currency_BusinessPartners" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Currency" Multiplicity="1" Role="FromRole_Assoc_VH_Currency_BusinessPartners"/>
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="*" Role="ToRole_Assoc_VH_Currency_BusinessPartners"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Currency_BusinessPartners">
<PropertyRef Name="Waers"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Currency_BusinessPartners">
<PropertyRef Name="CurrencyCode"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Currency_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Currency" Multiplicity="1" Role="FromRole_Assoc_VH_Currency_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_Currency_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Currency_Products">
<PropertyRef Name="Waers"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Currency_Products">
<PropertyRef Name="CurrencyCode"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Currency_SalesOrders" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Currency" Multiplicity="1" Role="FromRole_Assoc_VH_Currency_SalesOrders"/>
<End Type="GWSAMPLE_BASIC.SalesOrder" Multiplicity="*" Role="ToRole_Assoc_VH_Currency_SalesOrders"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Currency_SalesOrders">
<PropertyRef Name="Waers"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Currency_SalesOrders">
<PropertyRef Name="CurrencyCode"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Currency_SalesOrderLineItems" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Currency" Multiplicity="1" Role="FromRole_Assoc_VH_Currency_SalesOrderLineItems"/>
<End Type="GWSAMPLE_BASIC.SalesOrderLineItem" Multiplicity="*" Role="ToRole_Assoc_VH_Currency_SalesOrderLineItems"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Currency_SalesOrderLineItems">
<PropertyRef Name="Waers"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Currency_SalesOrderLineItems">
<PropertyRef Name="CurrencyCode"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_Product_SalesOrderLineItems" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="1" Role="FromRole_Assoc_Product_SalesOrderLineItems"/>
<End Type="GWSAMPLE_BASIC.SalesOrderLineItem" Multiplicity="*" Role="ToRole_Assoc_Product_SalesOrderLineItems"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_Product_SalesOrderLineItems">
<PropertyRef Name="ProductID"/>
</Principal>
<Dependent Role="ToRole_Assoc_Product_SalesOrderLineItems">
<PropertyRef Name="ProductID"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Language_Contacts" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Language" Multiplicity="1" Role="FromRole_Assoc_VH_Language_Contacts"/>
<End Type="GWSAMPLE_BASIC.Contact" Multiplicity="*" Role="ToRole_Assoc_VH_Language_Contacts"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Language_Contacts">
<PropertyRef Name="Spras"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Language_Contacts">
<PropertyRef Name="Language"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Category_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Category" Multiplicity="1" Role="FromRole_Assoc_VH_Category_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_Category_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Category_Products">
<PropertyRef Name="Category"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Category_Products">
<PropertyRef Name="Category"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_Sex_Contacts" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_Sex" Multiplicity="1" Role="FromRole_Assoc_VH_Sex_Contacts"/>
<End Type="GWSAMPLE_BASIC.Contact" Multiplicity="*" Role="ToRole_Assoc_VH_Sex_Contacts"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_Sex_Contacts">
<PropertyRef Name="Sex"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_Sex_Contacts">
<PropertyRef Name="Sex"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_ProductTypeCode_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_ProductTypeCode" Multiplicity="1" Role="FromRole_Assoc_VH_ProductTypeCode_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_ProductTypeCode_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_ProductTypeCode_Products">
<PropertyRef Name="TypeCode"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_ProductTypeCode_Products">
<PropertyRef Name="TypeCode"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_BPRole_BusinessPartners" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_BPRole" Multiplicity="1" Role="FromRole_Assoc_VH_BPRole_BusinessPartners"/>
<End Type="GWSAMPLE_BASIC.BusinessPartner" Multiplicity="*" Role="ToRole_Assoc_VH_BPRole_BusinessPartners"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_BPRole_BusinessPartners">
<PropertyRef Name="BpRole"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_BPRole_BusinessPartners">
<PropertyRef Name="BusinessPartnerRole"/>
</Dependent>
</ReferentialConstraint>
</Association>
<Association Name="Assoc_VH_UnitLength_Products" sap:content-version="1">
<End Type="GWSAMPLE_BASIC.VH_UnitLength" Multiplicity="1" Role="FromRole_Assoc_VH_UnitLength_Products"/>
<End Type="GWSAMPLE_BASIC.Product" Multiplicity="*" Role="ToRole_Assoc_VH_UnitLength_Products"/>
<ReferentialConstraint>
<Principal Role="FromRole_Assoc_VH_UnitLength_Products">
<PropertyRef Name="Msehi"/>
</Principal>
<Dependent Role="ToRole_Assoc_VH_UnitLength_Products">
<PropertyRef Name="DimUnit"/>
</Dependent>
</ReferentialConstraint>
</Association>
<EntityContainer Name="GWSAMPLE_BASIC_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx">
<EntitySet Name="BusinessPartnerSet" EntityType="GWSAMPLE_BASIC.BusinessPartner" sap:content-version="1"/>
<EntitySet Name="ProductSet" EntityType="GWSAMPLE_BASIC.Product" sap:content-version="1"/>
<EntitySet Name="SalesOrderSet" EntityType="GWSAMPLE_BASIC.SalesOrder" sap:updatable="false" sap:content-version="1"/>
<EntitySet Name="SalesOrderLineItemSet" EntityType="GWSAMPLE_BASIC.SalesOrderLineItem" sap:content-version="1"/>
<EntitySet Name="ContactSet" EntityType="GWSAMPLE_BASIC.Contact" sap:content-version="1"/>
<EntitySet Name="VH_SexSet" EntityType="GWSAMPLE_BASIC.VH_Sex" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_CountrySet" EntityType="GWSAMPLE_BASIC.VH_Country" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_AddressTypeSet" EntityType="GWSAMPLE_BASIC.VH_AddressType" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_CategorySet" EntityType="GWSAMPLE_BASIC.VH_Category" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_CurrencySet" EntityType="GWSAMPLE_BASIC.VH_Currency" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_UnitQuantitySet" EntityType="GWSAMPLE_BASIC.VH_UnitQuantity" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_UnitWeightSet" EntityType="GWSAMPLE_BASIC.VH_UnitWeight" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_UnitLengthSet" EntityType="GWSAMPLE_BASIC.VH_UnitLength" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_ProductTypeCodeSet" EntityType="GWSAMPLE_BASIC.VH_ProductTypeCode" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_BPRoleSet" EntityType="GWSAMPLE_BASIC.VH_BPRole" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<EntitySet Name="VH_LanguageSet" EntityType="GWSAMPLE_BASIC.VH_Language" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/>
<AssociationSet Name="Assoc_VH_Language_Contacts_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Language_Contacts" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_LanguageSet" Role="FromRole_Assoc_VH_Language_Contacts"/>
<End EntitySet="ContactSet" Role="ToRole_Assoc_VH_Language_Contacts"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Category_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Category_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CategorySet" Role="FromRole_Assoc_VH_Category_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_Category_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_ProductTypeCode_Products_AssocS" Association="GWSAMPLE_BASIC.Assoc_VH_ProductTypeCode_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_ProductTypeCodeSet" Role="FromRole_Assoc_VH_ProductTypeCode_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_ProductTypeCode_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_UnitQuantity_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_UnitQuantity_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_UnitQuantitySet" Role="FromRole_Assoc_VH_UnitQuantity_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_UnitQuantity_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Currency_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Currency_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CurrencySet" Role="FromRole_Assoc_VH_Currency_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_Currency_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Country_Contacts_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Country_Contacts" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CountrySet" Role="FromRole_Assoc_VH_Country_Contacts"/>
<End EntitySet="ContactSet" Role="ToRole_Assoc_VH_Country_Contacts"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_BPRole_BusinessPartners_AssocSe" Association="GWSAMPLE_BASIC.Assoc_VH_BPRole_BusinessPartners" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_BPRoleSet" Role="FromRole_Assoc_VH_BPRole_BusinessPartners"/>
<End EntitySet="BusinessPartnerSet" Role="ToRole_Assoc_VH_BPRole_BusinessPartners"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Sex_Contacts_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Sex_Contacts" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_SexSet" Role="FromRole_Assoc_VH_Sex_Contacts"/>
<End EntitySet="ContactSet" Role="ToRole_Assoc_VH_Sex_Contacts"/>
</AssociationSet>
<AssociationSet Name="Assoc_Product_SalesOrderLineItems_AssocS" Association="GWSAMPLE_BASIC.Assoc_Product_SalesOrderLineItems" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="ProductSet" Role="FromRole_Assoc_Product_SalesOrderLineItems"/>
<End EntitySet="SalesOrderLineItemSet" Role="ToRole_Assoc_Product_SalesOrderLineItems"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Currency_BusinessPartners_Assoc" Association="GWSAMPLE_BASIC.Assoc_VH_Currency_BusinessPartners" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CurrencySet" Role="FromRole_Assoc_VH_Currency_BusinessPartners"/>
<End EntitySet="BusinessPartnerSet" Role="ToRole_Assoc_VH_Currency_BusinessPartners"/>
</AssociationSet>
<AssociationSet Name="Assoc_BusinessPartner_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_BusinessPartner_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="BusinessPartnerSet" Role="FromRole_Assoc_BusinessPartner_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_BusinessPartner_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_UnitWeight_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_UnitWeight_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_UnitWeightSet" Role="FromRole_Assoc_VH_UnitWeight_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_UnitWeight_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Country_BusinessPartners_AssocS" Association="GWSAMPLE_BASIC.Assoc_VH_Country_BusinessPartners" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CountrySet" Role="FromRole_Assoc_VH_Country_BusinessPartners"/>
<End EntitySet="BusinessPartnerSet" Role="ToRole_Assoc_VH_Country_BusinessPartners"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_UnitLength_Products_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_UnitLength_Products" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_UnitLengthSet" Role="FromRole_Assoc_VH_UnitLength_Products"/>
<End EntitySet="ProductSet" Role="ToRole_Assoc_VH_UnitLength_Products"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Currency_SalesOrders_AssocSet" Association="GWSAMPLE_BASIC.Assoc_VH_Currency_SalesOrders" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CurrencySet" Role="FromRole_Assoc_VH_Currency_SalesOrders"/>
<End EntitySet="SalesOrderSet" Role="ToRole_Assoc_VH_Currency_SalesOrders"/>
</AssociationSet>
<AssociationSet Name="Assoc_SalesOrder_SalesOrderLineItems_Ass" Association="GWSAMPLE_BASIC.Assoc_SalesOrder_SalesOrderLineItems" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="SalesOrderSet" Role="FromRole_Assoc_SalesOrder_SalesOrderLineItems"/>
<End EntitySet="SalesOrderLineItemSet" Role="ToRole_Assoc_SalesOrder_SalesOrderLineItems"/>
</AssociationSet>
<AssociationSet Name="Assoc_BusinessPartner_SalesOrders_AssocS" Association="GWSAMPLE_BASIC.Assoc_BusinessPartner_SalesOrders" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="BusinessPartnerSet" Role="FromRole_Assoc_BusinessPartner_SalesOrders"/>
<End EntitySet="SalesOrderSet" Role="ToRole_Assoc_BusinessPartner_SalesOrders"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_Currency_SalesOrderLineItems_As" Association="GWSAMPLE_BASIC.Assoc_VH_Currency_SalesOrderLineItems" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_CurrencySet" Role="FromRole_Assoc_VH_Currency_SalesOrderLineItems"/>
<End EntitySet="SalesOrderLineItemSet" Role="ToRole_Assoc_VH_Currency_SalesOrderLineItems"/>
</AssociationSet>
<AssociationSet Name="Assoc_BusinessPartner_Contacts_AssocSet" Association="GWSAMPLE_BASIC.Assoc_BusinessPartner_Contacts" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="BusinessPartnerSet" Role="FromRole_Assoc_BusinessPartner_Contacts"/>
<End EntitySet="ContactSet" Role="ToRole_Assoc_BusinessPartner_Contacts"/>
</AssociationSet>
<AssociationSet Name="Assoc_VH_UnitQuantity_SalesOrderLineItem" Association="GWSAMPLE_BASIC.Assoc_VH_UnitQuantity_SalesOrderLineItem" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1">
<End EntitySet="VH_UnitQuantitySet" Role="FromRole_Assoc_VH_UnitQuantity_SalesOrderLineItem"/>
<End EntitySet="SalesOrderLineItemSet" Role="ToRole_Assoc_VH_UnitQuantity_SalesOrderLineItem"/>
</AssociationSet>
<FunctionImport Name="RegenerateAllData" ReturnType="GWSAMPLE_BASIC.CT_String" m:HttpMethod="POST">
<Parameter Name="NoOfSalesOrders" Type="Edm.Int32" Mode="In"/>
</FunctionImport>
<FunctionImport Name="SalesOrder_Confirm" ReturnType="GWSAMPLE_BASIC.SalesOrder" EntitySet="SalesOrderSet" m:HttpMethod="POST" sap:action-for="GWSAMPLE_BASIC.SalesOrder">
<Parameter Name="SalesOrderID" Type="Edm.String" Mode="In" MaxLength="10"/>
</FunctionImport>
<FunctionImport Name="SalesOrder_Cancel" ReturnType="GWSAMPLE_BASIC.SalesOrder" EntitySet="SalesOrderSet" m:HttpMethod="POST" sap:action-for="GWSAMPLE_BASIC.SalesOrder">
<Parameter Name="SalesOrderID" Type="Edm.String" Mode="In" MaxLength="10"/>
</FunctionImport>
<FunctionImport Name="SalesOrder_InvoiceCreated" ReturnType="GWSAMPLE_BASIC.SalesOrder" EntitySet="SalesOrderSet" m:HttpMethod="POST" sap:action-for="GWSAMPLE_BASIC.SalesOrder">
<Parameter Name="SalesOrderID" Type="Edm.String" Mode="In" MaxLength="10"/>
</FunctionImport>
<FunctionImport Name="SalesOrder_GoodsIssueCreated" ReturnType="GWSAMPLE_BASIC.SalesOrder" EntitySet="SalesOrderSet" m:HttpMethod="POST" sap:action-for="GWSAMPLE_BASIC.SalesOrder">
<Parameter Name="SalesOrderID" Type="Edm.String" Mode="In" MaxLength="10"/>
</FunctionImport>
</EntityContainer>
<atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="self" href="https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/$metadata"/>
<atom:link xmlns:atom="http://www.w3.org/2005/Atom" rel="latest-version" href="https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/$metadata"/>
</Schema>
</edmx:DataServices>
</edmx:Edmx>`;
