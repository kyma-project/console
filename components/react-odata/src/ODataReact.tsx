import React from "react";
import { parse } from "./tools/Parser";
import { Child } from "./types";
// import ODataFile from './ODataFiles/ODataProductV2'; //does not work, properties cut off
// import ODataFile from './ODataFiles/ODataNext'; //library cuts off many fields, not working
// import ODataFile from './ODataFiles/ODataProductV2'; //doesnt work
// import ODataFile from './ODataFiles/ODataFile'; //works
// import ODataFile from './ODataFiles/SAPodata'; //works
// import ODataFile from './ODataFiles/ODataTripV4'; //works
// import ODataFile from './ODataFiles/ODataFavourite3'; //works - no annotations
// import ODataFile from './ODataFiles/ODataFav5'; //works
// import ODataFile from './ODataFiles/ODataFav1'; //works - basic annotations
// import ODataFile from './ODataFiles/ODataProductV4'; //works - use this to see Service Documentation / Annotations
// import ODataFile from './ODataFiles/ODataProductsV3'; //works
// import ODataFile from "./ODataFiles/ODataFav11"; // works //most complex
import ODataFile from "./ODataFiles/ODataFav21"; // works // there are errors in console
// import ODataFile from "./ODataFiles/ODataNorthWindV2"; // works
// import ODataFile from "./ODataFiles/ODataFav3"; // works, but there are certain errors - look at console

import TableContainer from "./Table/TableContainer";
import { ErrorComponent } from "./components/ErrorComponent";

const ODataReact = () => {
  const data = parse.ParseFromString(ODataFile);
  const schema = data.getElementsByTagName("Schema");

  if (schema.length < 1) {
    return <ErrorComponent />;
  }

  const errors: Child[] = [];
  const dataForComponent: Child[] = [];

  schema[0].children.forEach((elem: Child) => {
    if (elem.name === "parsererror") {
      errors.push(elem);
    } else {
      dataForComponent.push(elem);
    }
  });

  return (
    <>
      {errors[0] && <ErrorComponent error={errors[0]} />}
      <TableContainer arg={dataForComponent} />
    </>
  );
};

export default ODataReact;
