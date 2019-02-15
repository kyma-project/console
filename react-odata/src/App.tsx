import React, { useState } from 'react';
import xslt from 'xslt';
import XMLParser from 'react-xml-parser';
import './App.css';
import v2tov4 from './ODataFiles/v2tov4';
// import ODataFile from './ODataFiles/ODataProductV2'; //does not work, properties cut off
// import ODataFile from './ODataFiles/ODataNext'; //library cuts off many fields, not working
// import ODataFile from './ODataFiles/ODataFile'; //works
// import ODataFile from './ODataFiles/ODataProductV2'; //works
// import ODataFile from './ODataFiles/SAPodata'; //works
import ODataFile from './ODataFiles/ODataTripV4'; //works
// import ODataFile from './ODataFiles/ODataFavourite3'; //works
// import ODataFile from './ODataFiles/ODataFav5'; //works
// import ODataFile from './ODataFiles/ODataFav1'; //works
// import ODataFile from './ODataFiles/ODataProductV4'; //works

import Container from './Table/Container';

const App = () => {
  // const [open, useOpen] = useState(false);
  // const [openT, useOpenT] = useState(false);
  const outXmlString = xslt(ODataFile, v2tov4);
  // const options = {
  //   // attributeNameFn: (val: any) => val.toUpperCase(),
  // };

  const xml = new XMLParser().parseFromString(outXmlString);

  // console.log(xml);

  const schema = xml.getElementsByTagName('Schema');

  if (schema.length < 1) {
    return (
      <div>
        {`No schema in data / format of the data is wrong (or the xslt is screwing up)`}
      </div>
    );
  }
  // const schema = convert.xml2js(outXmlString, options).elements;
  // const schema = convert.xml2js(outXmlString, options).elements[0].elements[5]
  // .elements[0].elements;
  // console.log(convert.xml2js(outXmlString, options));
  // console.log(xml.getElementsByTagName('Schema').length);

  return (
    <Container arg={schema[0].children} />
    // <div>{JSON.stringify(schema)}</div>
  );
};

export default App;
