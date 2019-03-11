export default `<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0"
    xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
    <edmx:DataServices>
        <Schema Namespace="NorthwindModel"
            xmlns="http://docs.oasis-open.org/odata/ns/edm">
            <EntityType Name="Category">
                <Key>
                    <PropertyRef Name="CategoryID" />
                </Key>
                <Property Name="CategoryID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                    xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                    <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                    <Property Name="Description" Type="Edm.String" MaxLength="max" />
                    <Property Name="Picture" Type="Edm.Binary" MaxLength="max" />
                    <NavigationProperty Name="Products" Type="Collection(NorthwindModel.Product)" Partner="Category" />
                </EntityType>
                <EntityType Name="CustomerDemographic">
                    <Key>
                        <PropertyRef Name="CustomerTypeID" />
                    </Key>
                    <Property Name="CustomerTypeID" Type="Edm.String" Nullable="false" MaxLength="10" />
                    <Property Name="CustomerDesc" Type="Edm.String" MaxLength="max" />
                    <NavigationProperty Name="Customers" Type="Collection(NorthwindModel.Customer)" Partner="CustomerDemographics" />
                </EntityType>
                <EntityType Name="Customer">
                    <Key>
                        <PropertyRef Name="CustomerID" />
                    </Key>
                    <Property Name="CustomerID" Type="Edm.String" Nullable="false" MaxLength="5" />
                    <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                    <Property Name="ContactName" Type="Edm.String" MaxLength="30" />
                    <Property Name="ContactTitle" Type="Edm.String" MaxLength="30" />
                    <Property Name="Address" Type="Edm.String" MaxLength="60" />
                    <Property Name="City" Type="Edm.String" MaxLength="15" />
                    <Property Name="Region" Type="Edm.String" MaxLength="15" />
                    <Property Name="PostalCode" Type="Edm.String" MaxLength="10" />
                    <Property Name="Country" Type="Edm.String" MaxLength="15" />
                    <Property Name="Phone" Type="Edm.String" MaxLength="24" />
                    <Property Name="Fax" Type="Edm.String" MaxLength="24" />
                    <NavigationProperty Name="Orders" Type="Collection(NorthwindModel.Order)" Partner="Customer" />
                    <NavigationProperty Name="CustomerDemographics" Type="Collection(NorthwindModel.CustomerDemographic)" Partner="Customers" />
                </EntityType>
                <EntityType Name="Employee">
                    <Key>
                        <PropertyRef Name="EmployeeID" />
                    </Key>
                    <Property Name="EmployeeID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                        xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                        <Property Name="LastName" Type="Edm.String" Nullable="false" MaxLength="20" />
                        <Property Name="FirstName" Type="Edm.String" Nullable="false" MaxLength="10" />
                        <Property Name="Title" Type="Edm.String" MaxLength="30" />
                        <Property Name="TitleOfCourtesy" Type="Edm.String" MaxLength="25" />
                        <Property Name="BirthDate" Type="Edm.DateTimeOffset" />
                        <Property Name="HireDate" Type="Edm.DateTimeOffset" />
                        <Property Name="Address" Type="Edm.String" MaxLength="60" />
                        <Property Name="City" Type="Edm.String" MaxLength="15" />
                        <Property Name="Region" Type="Edm.String" MaxLength="15" />
                        <Property Name="PostalCode" Type="Edm.String" MaxLength="10" />
                        <Property Name="Country" Type="Edm.String" MaxLength="15" />
                        <Property Name="HomePhone" Type="Edm.String" MaxLength="24" />
                        <Property Name="Extension" Type="Edm.String" MaxLength="4" />
                        <Property Name="Photo" Type="Edm.Binary" MaxLength="max" />
                        <Property Name="Notes" Type="Edm.String" MaxLength="max" />
                        <Property Name="ReportsTo" Type="Edm.Int32" />
                        <Property Name="PhotoPath" Type="Edm.String" MaxLength="255" />
                        <NavigationProperty Name="Employees1" Type="Collection(NorthwindModel.Employee)" Partner="Employee1" />
                        <NavigationProperty Name="Employee1" Type="NorthwindModel.Employee" Partner="Employees1">
                            <ReferentialConstraint Property="ReportsTo" ReferencedProperty="EmployeeID" />
                        </NavigationProperty>
                        <NavigationProperty Name="Orders" Type="Collection(NorthwindModel.Order)" Partner="Employee" />
                        <NavigationProperty Name="Territories" Type="Collection(NorthwindModel.Territory)" Partner="Employees" />
                    </EntityType>
                    <EntityType Name="Order_Detail">
                        <Key>
                            <PropertyRef Name="OrderID" />
                            <PropertyRef Name="ProductID" />
                        </Key>
                        <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                        <Property Name="ProductID" Type="Edm.Int32" Nullable="false" />
                        <Property Name="UnitPrice" Type="Edm.Decimal" Nullable="false" Precision="19" Scale="4" />
                        <Property Name="Quantity" Type="Edm.Int16" Nullable="false" />
                        <Property Name="Discount" Type="Edm.Single" Nullable="false" />
                        <NavigationProperty Name="Order" Type="NorthwindModel.Order" Nullable="false" Partner="Order_Details">
                            <ReferentialConstraint Property="OrderID" ReferencedProperty="OrderID" />
                        </NavigationProperty>
                        <NavigationProperty Name="Product" Type="NorthwindModel.Product" Nullable="false" Partner="Order_Details">
                            <ReferentialConstraint Property="ProductID" ReferencedProperty="ProductID" />
                        </NavigationProperty>
                    </EntityType>
                    <EntityType Name="Order">
                        <Key>
                            <PropertyRef Name="OrderID" />
                        </Key>
                        <Property Name="OrderID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                            xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                            <Property Name="CustomerID" Type="Edm.String" MaxLength="5" />
                            <Property Name="EmployeeID" Type="Edm.Int32" />
                            <Property Name="OrderDate" Type="Edm.DateTimeOffset" />
                            <Property Name="RequiredDate" Type="Edm.DateTimeOffset" />
                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                            <Property Name="ShipVia" Type="Edm.Int32" />
                            <Property Name="Freight" Type="Edm.Decimal" Precision="19" Scale="4" />
                            <Property Name="ShipName" Type="Edm.String" MaxLength="40" />
                            <Property Name="ShipAddress" Type="Edm.String" MaxLength="60" />
                            <Property Name="ShipCity" Type="Edm.String" MaxLength="15" />
                            <Property Name="ShipRegion" Type="Edm.String" MaxLength="15" />
                            <Property Name="ShipPostalCode" Type="Edm.String" MaxLength="10" />
                            <Property Name="ShipCountry" Type="Edm.String" MaxLength="15" />
                            <NavigationProperty Name="Customer" Type="NorthwindModel.Customer" Partner="Orders">
                                <ReferentialConstraint Property="CustomerID" ReferencedProperty="CustomerID" />
                            </NavigationProperty>
                            <NavigationProperty Name="Employee" Type="NorthwindModel.Employee" Partner="Orders">
                                <ReferentialConstraint Property="EmployeeID" ReferencedProperty="EmployeeID" />
                            </NavigationProperty>
                            <NavigationProperty Name="Order_Details" Type="Collection(NorthwindModel.Order_Detail)" Partner="Order" />
                            <NavigationProperty Name="Shipper" Type="NorthwindModel.Shipper" Partner="Orders">
                                <ReferentialConstraint Property="ShipVia" ReferencedProperty="ShipperID" />
                            </NavigationProperty>
                        </EntityType>
                        <EntityType Name="Product">
                            <Key>
                                <PropertyRef Name="ProductID" />
                            </Key>
                            <Property Name="ProductID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                                xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                                <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                <Property Name="SupplierID" Type="Edm.Int32" />
                                <Property Name="CategoryID" Type="Edm.Int32" />
                                <Property Name="QuantityPerUnit" Type="Edm.String" MaxLength="20" />
                                <Property Name="UnitPrice" Type="Edm.Decimal" Precision="19" Scale="4" />
                                <Property Name="UnitsInStock" Type="Edm.Int16" />
                                <Property Name="UnitsOnOrder" Type="Edm.Int16" />
                                <Property Name="ReorderLevel" Type="Edm.Int16" />
                                <Property Name="Discontinued" Type="Edm.Boolean" Nullable="false" />
                                <NavigationProperty Name="Category" Type="NorthwindModel.Category" Partner="Products">
                                    <ReferentialConstraint Property="CategoryID" ReferencedProperty="CategoryID" />
                                </NavigationProperty>
                                <NavigationProperty Name="Order_Details" Type="Collection(NorthwindModel.Order_Detail)" Partner="Product" />
                                <NavigationProperty Name="Supplier" Type="NorthwindModel.Supplier" Partner="Products">
                                    <ReferentialConstraint Property="SupplierID" ReferencedProperty="SupplierID" />
                                </NavigationProperty>
                            </EntityType>
                            <EntityType Name="Region">
                                <Key>
                                    <PropertyRef Name="RegionID" />
                                </Key>
                                <Property Name="RegionID" Type="Edm.Int32" Nullable="false" />
                                <Property Name="RegionDescription" Type="Edm.String" Nullable="false" MaxLength="50" />
                                <NavigationProperty Name="Territories" Type="Collection(NorthwindModel.Territory)" Partner="Region" />
                            </EntityType>
                            <EntityType Name="Shipper">
                                <Key>
                                    <PropertyRef Name="ShipperID" />
                                </Key>
                                <Property Name="ShipperID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                                    xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                                    <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                    <Property Name="Phone" Type="Edm.String" MaxLength="24" />
                                    <NavigationProperty Name="Orders" Type="Collection(NorthwindModel.Order)" Partner="Shipper" />
                                </EntityType>
                                <EntityType Name="Supplier">
                                    <Key>
                                        <PropertyRef Name="SupplierID" />
                                    </Key>
                                    <Property Name="SupplierID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                                        xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                                        <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                        <Property Name="ContactName" Type="Edm.String" MaxLength="30" />
                                        <Property Name="ContactTitle" Type="Edm.String" MaxLength="30" />
                                        <Property Name="Address" Type="Edm.String" MaxLength="60" />
                                        <Property Name="City" Type="Edm.String" MaxLength="15" />
                                        <Property Name="Region" Type="Edm.String" MaxLength="15" />
                                        <Property Name="PostalCode" Type="Edm.String" MaxLength="10" />
                                        <Property Name="Country" Type="Edm.String" MaxLength="15" />
                                        <Property Name="Phone" Type="Edm.String" MaxLength="24" />
                                        <Property Name="Fax" Type="Edm.String" MaxLength="24" />
                                        <Property Name="HomePage" Type="Edm.String" MaxLength="max" />
                                        <NavigationProperty Name="Products" Type="Collection(NorthwindModel.Product)" Partner="Supplier" />
                                    </EntityType>
                                    <EntityType Name="Territory">
                                        <Key>
                                            <PropertyRef Name="TerritoryID" />
                                        </Key>
                                        <Property Name="TerritoryID" Type="Edm.String" Nullable="false" MaxLength="20" />
                                        <Property Name="TerritoryDescription" Type="Edm.String" Nullable="false" MaxLength="50" />
                                        <Property Name="RegionID" Type="Edm.Int32" Nullable="false" />
                                        <NavigationProperty Name="Region" Type="NorthwindModel.Region" Nullable="false" Partner="Territories">
                                            <ReferentialConstraint Property="RegionID" ReferencedProperty="RegionID" />
                                        </NavigationProperty>
                                        <NavigationProperty Name="Employees" Type="Collection(NorthwindModel.Employee)" Partner="Territories" />
                                    </EntityType>
                                    <EntityType Name="Alphabetical_list_of_product">
                                        <Key>
                                            <PropertyRef Name="CategoryName" />
                                            <PropertyRef Name="Discontinued" />
                                            <PropertyRef Name="ProductID" />
                                            <PropertyRef Name="ProductName" />
                                        </Key>
                                        <Property Name="ProductID" Type="Edm.Int32" Nullable="false" />
                                        <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                        <Property Name="SupplierID" Type="Edm.Int32" />
                                        <Property Name="CategoryID" Type="Edm.Int32" />
                                        <Property Name="QuantityPerUnit" Type="Edm.String" MaxLength="20" />
                                        <Property Name="UnitPrice" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        <Property Name="UnitsInStock" Type="Edm.Int16" />
                                        <Property Name="UnitsOnOrder" Type="Edm.Int16" />
                                        <Property Name="ReorderLevel" Type="Edm.Int16" />
                                        <Property Name="Discontinued" Type="Edm.Boolean" Nullable="false" />
                                        <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                                    </EntityType>
                                    <EntityType Name="Category_Sales_for_1997">
                                        <Key>
                                            <PropertyRef Name="CategoryName" />
                                        </Key>
                                        <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                                        <Property Name="CategorySales" Type="Edm.Decimal" Precision="19" Scale="4" />
                                    </EntityType>
                                    <EntityType Name="Current_Product_List">
                                        <Key>
                                            <PropertyRef Name="ProductID" />
                                            <PropertyRef Name="ProductName" />
                                        </Key>
                                        <Property Name="ProductID" Type="Edm.Int32" Nullable="false" p5:StoreGeneratedPattern="Identity"
                                            xmlns:p5="http://schemas.microsoft.com/ado/2009/02/edm/annotation" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                        </EntityType>
                                        <EntityType Name="Customer_and_Suppliers_by_City">
                                            <Key>
                                                <PropertyRef Name="CompanyName" />
                                                <PropertyRef Name="Relationship" />
                                            </Key>
                                            <Property Name="City" Type="Edm.String" MaxLength="15" />
                                            <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="ContactName" Type="Edm.String" MaxLength="30" />
                                            <Property Name="Relationship" Type="Edm.String" Nullable="false" MaxLength="9" Unicode="false" />
                                        </EntityType>
                                        <EntityType Name="Invoice">
                                            <Key>
                                                <PropertyRef Name="CustomerName" />
                                                <PropertyRef Name="Discount" />
                                                <PropertyRef Name="OrderID" />
                                                <PropertyRef Name="ProductID" />
                                                <PropertyRef Name="ProductName" />
                                                <PropertyRef Name="Quantity" />
                                                <PropertyRef Name="Salesperson" />
                                                <PropertyRef Name="ShipperName" />
                                                <PropertyRef Name="UnitPrice" />
                                            </Key>
                                            <Property Name="ShipName" Type="Edm.String" MaxLength="40" />
                                            <Property Name="ShipAddress" Type="Edm.String" MaxLength="60" />
                                            <Property Name="ShipCity" Type="Edm.String" MaxLength="15" />
                                            <Property Name="ShipRegion" Type="Edm.String" MaxLength="15" />
                                            <Property Name="ShipPostalCode" Type="Edm.String" MaxLength="10" />
                                            <Property Name="ShipCountry" Type="Edm.String" MaxLength="15" />
                                            <Property Name="CustomerID" Type="Edm.String" MaxLength="5" />
                                            <Property Name="CustomerName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="Address" Type="Edm.String" MaxLength="60" />
                                            <Property Name="City" Type="Edm.String" MaxLength="15" />
                                            <Property Name="Region" Type="Edm.String" MaxLength="15" />
                                            <Property Name="PostalCode" Type="Edm.String" MaxLength="10" />
                                            <Property Name="Country" Type="Edm.String" MaxLength="15" />
                                            <Property Name="Salesperson" Type="Edm.String" Nullable="false" MaxLength="31" />
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="OrderDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="RequiredDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="ShipperName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="ProductID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="UnitPrice" Type="Edm.Decimal" Nullable="false" Precision="19" Scale="4" />
                                            <Property Name="Quantity" Type="Edm.Int16" Nullable="false" />
                                            <Property Name="Discount" Type="Edm.Single" Nullable="false" />
                                            <Property Name="ExtendedPrice" Type="Edm.Decimal" Precision="19" Scale="4" />
                                            <Property Name="Freight" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Order_Details_Extended">
                                            <Key>
                                                <PropertyRef Name="Discount" />
                                                <PropertyRef Name="OrderID" />
                                                <PropertyRef Name="ProductID" />
                                                <PropertyRef Name="ProductName" />
                                                <PropertyRef Name="Quantity" />
                                                <PropertyRef Name="UnitPrice" />
                                            </Key>
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="ProductID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="UnitPrice" Type="Edm.Decimal" Nullable="false" Precision="19" Scale="4" />
                                            <Property Name="Quantity" Type="Edm.Int16" Nullable="false" />
                                            <Property Name="Discount" Type="Edm.Single" Nullable="false" />
                                            <Property Name="ExtendedPrice" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Order_Subtotal">
                                            <Key>
                                                <PropertyRef Name="OrderID" />
                                            </Key>
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="Subtotal" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Orders_Qry">
                                            <Key>
                                                <PropertyRef Name="CompanyName" />
                                                <PropertyRef Name="OrderID" />
                                            </Key>
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="CustomerID" Type="Edm.String" MaxLength="5" />
                                            <Property Name="EmployeeID" Type="Edm.Int32" />
                                            <Property Name="OrderDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="RequiredDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="ShipVia" Type="Edm.Int32" />
                                            <Property Name="Freight" Type="Edm.Decimal" Precision="19" Scale="4" />
                                            <Property Name="ShipName" Type="Edm.String" MaxLength="40" />
                                            <Property Name="ShipAddress" Type="Edm.String" MaxLength="60" />
                                            <Property Name="ShipCity" Type="Edm.String" MaxLength="15" />
                                            <Property Name="ShipRegion" Type="Edm.String" MaxLength="15" />
                                            <Property Name="ShipPostalCode" Type="Edm.String" MaxLength="10" />
                                            <Property Name="ShipCountry" Type="Edm.String" MaxLength="15" />
                                            <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="Address" Type="Edm.String" MaxLength="60" />
                                            <Property Name="City" Type="Edm.String" MaxLength="15" />
                                            <Property Name="Region" Type="Edm.String" MaxLength="15" />
                                            <Property Name="PostalCode" Type="Edm.String" MaxLength="10" />
                                            <Property Name="Country" Type="Edm.String" MaxLength="15" />
                                        </EntityType>
                                        <EntityType Name="Product_Sales_for_1997">
                                            <Key>
                                                <PropertyRef Name="CategoryName" />
                                                <PropertyRef Name="ProductName" />
                                            </Key>
                                            <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="ProductSales" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Products_Above_Average_Price">
                                            <Key>
                                                <PropertyRef Name="ProductName" />
                                            </Key>
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="UnitPrice" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Products_by_Category">
                                            <Key>
                                                <PropertyRef Name="CategoryName" />
                                                <PropertyRef Name="Discontinued" />
                                                <PropertyRef Name="ProductName" />
                                            </Key>
                                            <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="QuantityPerUnit" Type="Edm.String" MaxLength="20" />
                                            <Property Name="UnitsInStock" Type="Edm.Int16" />
                                            <Property Name="Discontinued" Type="Edm.Boolean" Nullable="false" />
                                        </EntityType>
                                        <EntityType Name="Sales_by_Category">
                                            <Key>
                                                <PropertyRef Name="CategoryID" />
                                                <PropertyRef Name="CategoryName" />
                                                <PropertyRef Name="ProductName" />
                                            </Key>
                                            <Property Name="CategoryID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="CategoryName" Type="Edm.String" Nullable="false" MaxLength="15" />
                                            <Property Name="ProductName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="ProductSales" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Sales_Totals_by_Amount">
                                            <Key>
                                                <PropertyRef Name="CompanyName" />
                                                <PropertyRef Name="OrderID" />
                                            </Key>
                                            <Property Name="SaleAmount" Type="Edm.Decimal" Precision="19" Scale="4" />
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="CompanyName" Type="Edm.String" Nullable="false" MaxLength="40" />
                                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                                        </EntityType>
                                        <EntityType Name="Summary_of_Sales_by_Quarter">
                                            <Key>
                                                <PropertyRef Name="OrderID" />
                                            </Key>
                                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="Subtotal" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                        <EntityType Name="Summary_of_Sales_by_Year">
                                            <Key>
                                                <PropertyRef Name="OrderID" />
                                            </Key>
                                            <Property Name="ShippedDate" Type="Edm.DateTimeOffset" />
                                            <Property Name="OrderID" Type="Edm.Int32" Nullable="false" />
                                            <Property Name="Subtotal" Type="Edm.Decimal" Precision="19" Scale="4" />
                                        </EntityType>
                                    </Schema>
                                    <Schema Namespace="ODataWebExperimental.Northwind.Model"
                                        xmlns="http://docs.oasis-open.org/odata/ns/edm">
                                        <EntityContainer Name="NorthwindEntities" p4:LazyLoadingEnabled="true"
                                            xmlns:p4="http://schemas.microsoft.com/ado/2009/02/edm/annotation">
                                            <EntitySet Name="Categories" EntityType="NorthwindModel.Category">
                                                <NavigationPropertyBinding Path="Products" Target="Products" />
                                            </EntitySet>
                                            <EntitySet Name="CustomerDemographics" EntityType="NorthwindModel.CustomerDemographic">
                                                <NavigationPropertyBinding Path="Customers" Target="Customers" />
                                            </EntitySet>
                                            <EntitySet Name="Customers" EntityType="NorthwindModel.Customer">
                                                <NavigationPropertyBinding Path="CustomerDemographics" Target="CustomerDemographics" />
                                                <NavigationPropertyBinding Path="Orders" Target="Orders" />
                                            </EntitySet>
                                            <EntitySet Name="Employees" EntityType="NorthwindModel.Employee">
                                                <NavigationPropertyBinding Path="Employees1" Target="Employees" />
                                                <NavigationPropertyBinding Path="Employee1" Target="Employees" />
                                                <NavigationPropertyBinding Path="Orders" Target="Orders" />
                                                <NavigationPropertyBinding Path="Territories" Target="Territories" />
                                            </EntitySet>
                                            <EntitySet Name="Order_Details" EntityType="NorthwindModel.Order_Detail">
                                                <NavigationPropertyBinding Path="Order" Target="Orders" />
                                                <NavigationPropertyBinding Path="Product" Target="Products" />
                                            </EntitySet>
                                            <EntitySet Name="Orders" EntityType="NorthwindModel.Order">
                                                <NavigationPropertyBinding Path="Customer" Target="Customers" />
                                                <NavigationPropertyBinding Path="Employee" Target="Employees" />
                                                <NavigationPropertyBinding Path="Order_Details" Target="Order_Details" />
                                                <NavigationPropertyBinding Path="Shipper" Target="Shippers" />
                                            </EntitySet>
                                            <EntitySet Name="Products" EntityType="NorthwindModel.Product">
                                                <NavigationPropertyBinding Path="Category" Target="Categories" />
                                                <NavigationPropertyBinding Path="Order_Details" Target="Order_Details" />
                                                <NavigationPropertyBinding Path="Supplier" Target="Suppliers" />
                                            </EntitySet>
                                            <EntitySet Name="Regions" EntityType="NorthwindModel.Region">
                                                <NavigationPropertyBinding Path="Territories" Target="Territories" />
                                            </EntitySet>
                                            <EntitySet Name="Shippers" EntityType="NorthwindModel.Shipper">
                                                <NavigationPropertyBinding Path="Orders" Target="Orders" />
                                            </EntitySet>
                                            <EntitySet Name="Suppliers" EntityType="NorthwindModel.Supplier">
                                                <NavigationPropertyBinding Path="Products" Target="Products" />
                                            </EntitySet>
                                            <EntitySet Name="Territories" EntityType="NorthwindModel.Territory">
                                                <NavigationPropertyBinding Path="Employees" Target="Employees" />
                                                <NavigationPropertyBinding Path="Region" Target="Regions" />
                                            </EntitySet>
                                            <EntitySet Name="Alphabetical_list_of_products" EntityType="NorthwindModel.Alphabetical_list_of_product" />
                                            <EntitySet Name="Category_Sales_for_1997" EntityType="NorthwindModel.Category_Sales_for_1997" />
                                            <EntitySet Name="Current_Product_Lists" EntityType="NorthwindModel.Current_Product_List" />
                                            <EntitySet Name="Customer_and_Suppliers_by_Cities" EntityType="NorthwindModel.Customer_and_Suppliers_by_City" />
                                            <EntitySet Name="Invoices" EntityType="NorthwindModel.Invoice" />
                                            <EntitySet Name="Order_Details_Extendeds" EntityType="NorthwindModel.Order_Details_Extended" />
                                            <EntitySet Name="Order_Subtotals" EntityType="NorthwindModel.Order_Subtotal" />
                                            <EntitySet Name="Orders_Qries" EntityType="NorthwindModel.Orders_Qry" />
                                            <EntitySet Name="Product_Sales_for_1997" EntityType="NorthwindModel.Product_Sales_for_1997" />
                                            <EntitySet Name="Products_Above_Average_Prices" EntityType="NorthwindModel.Products_Above_Average_Price" />
                                            <EntitySet Name="Products_by_Categories" EntityType="NorthwindModel.Products_by_Category" />
                                            <EntitySet Name="Sales_by_Categories" EntityType="NorthwindModel.Sales_by_Category" />
                                            <EntitySet Name="Sales_Totals_by_Amounts" EntityType="NorthwindModel.Sales_Totals_by_Amount" />
                                            <EntitySet Name="Summary_of_Sales_by_Quarters" EntityType="NorthwindModel.Summary_of_Sales_by_Quarter" />
                                            <EntitySet Name="Summary_of_Sales_by_Years" EntityType="NorthwindModel.Summary_of_Sales_by_Year" />
                                        </EntityContainer>
                                    </Schema>
                                </edmx:DataServices>
                            </edmx:Edmx>`;
