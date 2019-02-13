import React, { useState } from 'react';
import xslt from 'xslt';
import XMLParser from 'react-xml-parser';
import './App.css';
import v2tov4 from './ODataFiles/v2tov4';
// import ODataFile from './ODataFiles/ODataFile'; //works
// import ODataFile from './ODataFiles/ODataProductV2'; //works
// import ODataFile from './ODataFiles/ODataNext'; //library cuts off many fields, not working
// import ODataFile from './ODataFiles/SAPodata'; //works
// import ODataFile from './ODataFiles/ODataTripV4'; //works
// import ODataFile from './ODataFiles/ODataFavourite3'; //works
import ODataFile from './ODataFiles/ODataFav5'; //works

// import convert from 'xml-js';
import Modal from 'react-responsive-modal';

const App = () => {
  // const [open, useOpen] = useState(false);
  // const [openT, useOpenT] = useState(false);
  const outXmlString = xslt(ODataFile, v2tov4);
  // const options = {
  //   // attributeNameFn: (val: any) => val.toUpperCase(),
  // };
  const xml = new XMLParser().parseFromString(outXmlString);
  // console.log(xml);
  const schema = xml.getElementsByTagName('Schema')[0].children;
  // const schema = convert.xml2js(outXmlString, options).elements;
  // const schema = convert.xml2js(outXmlString, options).elements[0].elements[5]
  // .elements[0].elements;
  // console.log(convert.xml2js(outXmlString, options));
  // console.log(xml.getElementsByTagName('Schema').length);
  // console.log(schema);
  return (
    <>
      <div className="App">
        {schema.map((elem: any, index: number) => (
          <Table key={index} data={elem} />
        ))}
      </div>
      {/* <button onClick={() => useOpen(true)}>xasd</button>
      <Modal open={open} onClose={() => useOpen(false)} center>
        <div>
          <button onClick={() => useOpenT(true)}>xasd</button>
          <Modal open={openT} onClose={() => useOpenT(false)} center>
            <div>
              <h1>asd</h1>
            </div>
          </Modal>
        </div>
      </Modal> */}
    </>

    // <div>{JSON.stringify(schema)}</div>
  );
};

const Table = ({ data }: { data: any }): JSX.Element => {
  function makeUnique(value: any, index: number, self: any) {
    return self.indexOf(value) === index;
  }

  if (!Array.isArray(data.children)) {
    return <div>{JSON.stringify(data)}</div>;
  }

  const filteredData: any[] = data.children.filter((el: any) => {
    if (
      el.name === 'Key' ||
      el.name === 'NavigationProperty' ||
      el.name === 'EntityContainer'
    ) {
      return false;
    }
    return true;
  });

  const columnData = filteredData
    .flatMap((elem: any) => Object.keys(elem.attributes))
    .filter(makeUnique);

  console.log(data);

  let title;
  if (data.name === 'Annotations') {
    title = 'Service Documentation / Annotations';
  } else {
    title = `${data.name || 'Entity'} ${data.attributes.Name ||
      data.attributes.Term ||
      data.attributes.Target}`;
  }

  return (
    <table>
      <thead>
        <tr>
          <td colSpan={columnData.length}>{title}</td>
        </tr>
        <tr>
          {columnData.map((elem: string, index: number) => (
            <th key={index}>{elem}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {filteredData.map((elem: any, idx: number) => {
          return (
            <tr key={idx}>
              {columnData.map((row: string, index: number) => {
                return <td key={index}>{elem.attributes[row]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default App;
