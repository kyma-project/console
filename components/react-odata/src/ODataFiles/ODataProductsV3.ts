export default `<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="1.0"
    xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx">
    <edmx:DataServices m:DataServiceVersion="3.0" m:MaxDataServiceVersion="3.0"
        xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">
        <Schema Namespace="ODataDemo"
            xmlns="http://schemas.microsoft.com/ado/2009/11/edm">
            <EntityType Name="Product">
                <Key>
                    <PropertyRef Name="ID" />
                </Key>
                <Property Name="ID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Name" Type="Edm.String" m:FC_TargetPath="SyndicationTitle" m:FC_ContentKind="text" m:FC_KeepInContent="false" />
                <Property Name="Description" Type="Edm.String" m:FC_TargetPath="SyndicationSummary" m:FC_ContentKind="text" m:FC_KeepInContent="false" />
                <Property Name="ReleaseDate" Type="Edm.DateTime" Nullable="false" />
                <Property Name="DiscontinuedDate" Type="Edm.DateTime" />
                <Property Name="Rating" Type="Edm.Int16" Nullable="false" />
                <Property Name="Price" Type="Edm.Double" Nullable="false" />
                <NavigationProperty Name="Categories" Relationship="ODataDemo.Product_Categories_Category_Products" ToRole="Category_Products" FromRole="Product_Categories" />
                <NavigationProperty Name="Supplier" Relationship="ODataDemo.Product_Supplier_Supplier_Products" ToRole="Supplier_Products" FromRole="Product_Supplier" />
                <NavigationProperty Name="ProductDetail" Relationship="ODataDemo.Product_ProductDetail_ProductDetail_Product" ToRole="ProductDetail_Product" FromRole="Product_ProductDetail" />
            </EntityType>
            <EntityType Name="FeaturedProduct" BaseType="ODataDemo.Product">
                <NavigationProperty Name="Advertisement" Relationship="ODataDemo.FeaturedProduct_Advertisement_Advertisement_FeaturedProduct" ToRole="Advertisement_FeaturedProduct" FromRole="FeaturedProduct_Advertisement" />
            </EntityType>
            <EntityType Name="ProductDetail">
                <Key>
                    <PropertyRef Name="ProductID" />
                </Key>
                <Property Name="ProductID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Details" Type="Edm.String" />
                <NavigationProperty Name="Product" Relationship="ODataDemo.Product_ProductDetail_ProductDetail_Product" ToRole="Product_ProductDetail" FromRole="ProductDetail_Product" />
            </EntityType>
            <EntityType Name="Category" OpenType="true">
                <Key>
                    <PropertyRef Name="ID" />
                </Key>
                <Property Name="ID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Name" Type="Edm.String" m:FC_TargetPath="SyndicationTitle" m:FC_ContentKind="text" m:FC_KeepInContent="true" />
                <NavigationProperty Name="Products" Relationship="ODataDemo.Product_Categories_Category_Products" ToRole="Product_Categories" FromRole="Category_Products" />
            </EntityType>
            <EntityType Name="Supplier">
                <Key>
                    <PropertyRef Name="ID" />
                </Key>
                <Property Name="ID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Name" Type="Edm.String" m:FC_TargetPath="SyndicationTitle" m:FC_ContentKind="text" m:FC_KeepInContent="true" />
                <Property Name="Address" Type="ODataDemo.Address" />
                <Property Name="Location" Type="Edm.GeographyPoint" SRID="Variable" />
                <Property Name="Concurrency" Type="Edm.Int32" ConcurrencyMode="Fixed" Nullable="false" />
                <NavigationProperty Name="Products" Relationship="ODataDemo.Product_Supplier_Supplier_Products" ToRole="Product_Supplier" FromRole="Supplier_Products" />
            </EntityType>
            <ComplexType Name="Address">
                <Property Name="Street" Type="Edm.String" />
                <Property Name="City" Type="Edm.String" />
                <Property Name="State" Type="Edm.String" />
                <Property Name="ZipCode" Type="Edm.String" />
                <Property Name="Country" Type="Edm.String" />
            </ComplexType>
            <EntityType Name="Person">
                <Key>
                    <PropertyRef Name="ID" />
                </Key>
                <Property Name="ID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Name" Type="Edm.String" />
                <NavigationProperty Name="PersonDetail" Relationship="ODataDemo.Person_PersonDetail_PersonDetail_Person" ToRole="PersonDetail_Person" FromRole="Person_PersonDetail" />
            </EntityType>
            <EntityType Name="Customer" BaseType="ODataDemo.Person">
                <Property Name="TotalExpense" Type="Edm.Decimal" Nullable="false" />
            </EntityType>
            <EntityType Name="Employee" BaseType="ODataDemo.Person">
                <Property Name="EmployeeID" Type="Edm.Int64" Nullable="false" />
                <Property Name="HireDate" Type="Edm.DateTime" Nullable="false" />
                <Property Name="Salary" Type="Edm.Single" Nullable="false" />
            </EntityType>
            <EntityType Name="PersonDetail">
                <Key>
                    <PropertyRef Name="PersonID" />
                </Key>
                <Property Name="PersonID" Type="Edm.Int32" Nullable="false" />
                <Property Name="Age" Type="Edm.Byte" Nullable="false" />
                <Property Name="Gender" Type="Edm.Boolean" Nullable="false" />
                <Property Name="Phone" Type="Edm.String" />
                <Property Name="Address" Type="ODataDemo.Address" />
                <Property Name="Photo" Type="Edm.Stream" Nullable="false" />
                <NavigationProperty Name="Person" Relationship="ODataDemo.Person_PersonDetail_PersonDetail_Person" ToRole="Person_PersonDetail" FromRole="PersonDetail_Person" />
            </EntityType>
            <EntityType Name="Advertisement" m:HasStream="true">
                <Key>
                    <PropertyRef Name="ID" />
                </Key>
                <Property Name="ID" Type="Edm.Guid" Nullable="false" />
                <Property Name="Name" Type="Edm.String" />
                <Property Name="AirDate" Type="Edm.DateTime" Nullable="false" />
                <NavigationProperty Name="FeaturedProduct" Relationship="ODataDemo.FeaturedProduct_Advertisement_Advertisement_FeaturedProduct" ToRole="FeaturedProduct_Advertisement" FromRole="Advertisement_FeaturedProduct" />
            </EntityType>
            <Association Name="Product_Categories_Category_Products">
                <End Type="ODataDemo.Category" Role="Category_Products" Multiplicity="*" />
                <End Type="ODataDemo.Product" Role="Product_Categories" Multiplicity="*" />
            </Association>
            <Association Name="Product_Supplier_Supplier_Products">
                <End Type="ODataDemo.Supplier" Role="Supplier_Products" Multiplicity="0..1" />
                <End Type="ODataDemo.Product" Role="Product_Supplier" Multiplicity="*" />
            </Association>
            <Association Name="Product_ProductDetail_ProductDetail_Product">
                <End Type="ODataDemo.ProductDetail" Role="ProductDetail_Product" Multiplicity="0..1" />
                <End Type="ODataDemo.Product" Role="Product_ProductDetail" Multiplicity="0..1" />
            </Association>
            <Association Name="FeaturedProduct_Advertisement_Advertisement_FeaturedProduct">
                <End Type="ODataDemo.Advertisement" Role="Advertisement_FeaturedProduct" Multiplicity="0..1" />
                <End Type="ODataDemo.FeaturedProduct" Role="FeaturedProduct_Advertisement" Multiplicity="0..1" />
            </Association>
            <Association Name="Person_PersonDetail_PersonDetail_Person">
                <End Type="ODataDemo.PersonDetail" Role="PersonDetail_Person" Multiplicity="0..1" />
                <End Type="ODataDemo.Person" Role="Person_PersonDetail" Multiplicity="0..1" />
            </Association>
            <EntityContainer Name="DemoService" m:IsDefaultEntityContainer="true">
                <EntitySet Name="Products" EntityType="ODataDemo.Product" />
                <EntitySet Name="ProductDetails" EntityType="ODataDemo.ProductDetail" />
                <EntitySet Name="Categories" EntityType="ODataDemo.Category" />
                <EntitySet Name="Suppliers" EntityType="ODataDemo.Supplier" />
                <EntitySet Name="Persons" EntityType="ODataDemo.Person" />
                <EntitySet Name="PersonDetails" EntityType="ODataDemo.PersonDetail" />
                <EntitySet Name="Advertisements" EntityType="ODataDemo.Advertisement" />
                <FunctionImport Name="GetProductsByRating" ReturnType="Collection(ODataDemo.Product)" EntitySet="Products" m:HttpMethod="GET">
                    <Parameter Name="rating" Type="Edm.Int16" Nullable="false" />
                </FunctionImport>
                <AssociationSet Name="Products_Advertisement_Advertisements" Association="ODataDemo.FeaturedProduct_Advertisement_Advertisement_FeaturedProduct">
                    <End Role="FeaturedProduct_Advertisement" EntitySet="Products" />
                    <End Role="Advertisement_FeaturedProduct" EntitySet="Advertisements" />
                </AssociationSet>
                <AssociationSet Name="Products_Categories_Categories" Association="ODataDemo.Product_Categories_Category_Products">
                    <End Role="Product_Categories" EntitySet="Products" />
                    <End Role="Category_Products" EntitySet="Categories" />
                </AssociationSet>
                <AssociationSet Name="Products_Supplier_Suppliers" Association="ODataDemo.Product_Supplier_Supplier_Products">
                    <End Role="Product_Supplier" EntitySet="Products" />
                    <End Role="Supplier_Products" EntitySet="Suppliers" />
                </AssociationSet>
                <AssociationSet Name="Products_ProductDetail_ProductDetails" Association="ODataDemo.Product_ProductDetail_ProductDetail_Product">
                    <End Role="Product_ProductDetail" EntitySet="Products" />
                    <End Role="ProductDetail_Product" EntitySet="ProductDetails" />
                </AssociationSet>
                <AssociationSet Name="Persons_PersonDetail_PersonDetails" Association="ODataDemo.Person_PersonDetail_PersonDetail_Person">
                    <End Role="Person_PersonDetail" EntitySet="Persons" />
                    <End Role="PersonDetail_Person" EntitySet="PersonDetails" />
                </AssociationSet>
            </EntityContainer>
            <Annotations Target="ODataDemo.DemoService">
                <ValueAnnotation Term="Org.OData.Display.V1.Description" String="This is a sample OData service with vocabularies" />
            </Annotations>
            <Annotations Target="ODataDemo.Product">
                <ValueAnnotation Term="Org.OData.Display.V1.Description" String="All Products available in the online store" />
            </Annotations>
            <Annotations Target="ODataDemo.Product/Name">
                <ValueAnnotation Term="Org.OData.Display.V1.DisplayName" String="Product Name" />
            </Annotations>
            <Annotations Target="ODataDemo.DemoService/Suppliers">
                <ValueAnnotation Term="Org.OData.Publication.V1.PublisherName" String="Microsoft Corp." />
                <ValueAnnotation Term="Org.OData.Publication.V1.PublisherId" String="MSFT" />
                <ValueAnnotation Term="Org.OData.Publication.V1.Keywords" String="Inventory, Supplier, Advertisers, Sales, Finance" />
                <ValueAnnotation Term="Org.OData.Publication.V1.AttributionUrl" String="http://www.odata.org/" />
                <ValueAnnotation Term="Org.OData.Publication.V1.AttributionDescription" String="All rights reserved" />
                <ValueAnnotation Term="Org.OData.Publication.V1.DocumentationUrl " String="http://www.odata.org/" />
                <ValueAnnotation Term="Org.OData.Publication.V1.TermsOfUseUrl" String="All rights reserved" />
                <ValueAnnotation Term="Org.OData.Publication.V1.PrivacyPolicyUrl" String="http://www.odata.org/" />
                <ValueAnnotation Term="Org.OData.Publication.V1.LastModified" String="4/2/2013" />
                <ValueAnnotation Term="Org.OData.Publication.V1.ImageUrl " String="http://www.odata.org/" />
            </Annotations>
        </Schema>
    </edmx:DataServices>
</edmx:Edmx>`;
