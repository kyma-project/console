import React from 'react';
import xslt from 'xslt';
import XMLParser from 'react-xml-parser';
import './App.css';
import v2tov4 from './ODataFiles/v2tov4';
// import ODataFile from './ODataFiles/ODataProductV2'; //does not work, properties cut off
// import ODataFile from './ODataFiles/ODataNext'; //library cuts off many fields, not working
// import ODataFile from './ODataFiles/ODataProductV2'; //doesnt work
// import ODataFile from './ODataFiles/ODataFile2'; //works
// import ODataFile from './ODataFiles/SAPodata'; //works
// import ODataFile from './ODataFiles/ODataTripV4'; //works
// import ODataFile from './ODataFiles/ODataFavourite3'; //works - no annotations
// import ODataFile from './ODataFiles/ODataFav5'; //works
// import ODataFile from './ODataFiles/ODataFav1'; //works - basic annotations
// import ODataFile from './ODataFiles/ODataProductV4'; //works
// import ODataFile from './ODataFiles/ODataProductsV3'; //works
import ODataFile from './ODataFiles/ODataFav11'; //works

import Container from './Table/Container';

const App = () => {
  const outXmlString = xslt(ODataFile, v2tov4);
  const xml = new XMLParser().parseFromString(outXmlString);

  const schema = xml.getElementsByTagName('Schema');
  //TODO make Collection work
  if (schema.length < 1) {
    return (
      <p>
        {`No schema in data / format of the data is wrong (or the xslt is screwing up)`}
      </p>
    );
  }

  return (
    <Container arg={schema[0].children} />
    // <div>{JSON.stringify(schema)}</div>
  );
};

export default App;
