import React from "react";
import xslt from "xslt";
import XMLParser from "react-xml-parser";
import "./App.css";
import v2tov4 from "./ODataFiles/v2tov4";
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
import ODataFile from "./ODataFiles/ODataFav11"; // works //most complex
// import ODataFile from './ODataFiles/ODataNorthWindV2'; //works
// import ODataFile from './ODataFiles/ODataFav3'; //works

import TableContainer from "./Table/TableContainer";

const App = () => {
  const outXmlString = xslt(ODataFile, v2tov4, {
    fullDocument: true,
    removeDupNamespace: false,
    removeNullNamespace: false,
    removeAllNamespaces: false,
    removeNamespacedNamespace: false,
  });

  // console.log(outXmlString);

  const xml = new XMLParser().parseFromString(outXmlString);

  const schema = xml.getElementsByTagName("Schema");

  if (schema.length < 1) {
    return <p>{`No schema in data / format of the data is wrong`}</p>;
  }

  const errors: Children[] = schema[0].children.filter(
    (elem: Children) => elem.name === "parsererror",
  );
  if (errors.length > 0) {
    console.error(errors[0]);
  }
  return <TableContainer arg={schema[0].children} />;
};

export default App;
