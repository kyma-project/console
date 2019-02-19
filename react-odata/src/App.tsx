import React from "react";
import xslt from "xslt";
import XMLParser from "react-xml-parser";
import "./App.css";
import v2tov4 from "./tools/V2V3toV4";
import { Children } from "./Interfaces";
// import ODataFile from './ODataFiles/ODataProductV2'; //does not work, properties cut off
// import ODataFile from './ODataFiles/ODataNext'; //library cuts off many fields, not working
// import ODataFile from './ODataFiles/ODataProductV2'; //doesnt work
// import ODataFile from './ODataFiles/ODataFile'; //works
// import ODataFile from './ODataFiles/SAPodata'; //works
// import ODataFile from './ODataFiles/ODataTripV4'; //works
// import ODataFile from './ODataFiles/ODataFavourite3'; //works - no annotations
// import ODataFile from './ODataFiles/ODataFav5'; //works
// import ODataFile from './ODataFiles/ODataFav1'; //works - basic annotations
// import ODataFile from './ODataFiles/ODataProductV4'; //works
// import ODataFile from './ODataFiles/ODataProductsV3'; //works
// import ODataFile from "./ODataFiles/ODataFav11"; // works //most complex
import ODataFile from "./ODataFiles/ODataNorthWindV2"; // works
// import ODataFile from "./ODataFiles/ODataFav3"; // works, but there are certain errors - look at console

import TableContainer from "./Table/TableContainer";

const App = () => {
  const outXmlString = xslt(ODataFile, v2tov4, {
    fullDocument: true,
    removeDupNamespace: false,
    removeNullNamespace: false,
    removeAllNamespaces: false,
    removeNamespacedNamespace: false,
  });

  const xml = new XMLParser().parseFromString(outXmlString);

  const schema = xml.getElementsByTagName("Schema");

  if (schema.length < 1) {
    return <p>{`No schema in data / format of the data is wrong`}</p>;
  }

  const errors: Children[] = [];
  const dataForComponent: Children[] = [];

  schema[0].children.forEach((elem: Children) => {
    if (elem.name === "parsererror") {
      errors.push(elem);
    } else {
      dataForComponent.push(elem);
    }
  });

  if (errors.length > 0) {
    console.error(errors[0]);
  }

  return <TableContainer arg={dataForComponent} />;
};

export default App;
