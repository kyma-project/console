import React from 'react';
import xslt from 'xslt';

// import ODataFile from './ODataFile2'; //works

// import ODataFile from './ODataProductV2'; //works

// import ODataFile from './ODataNext'; //library cuts off many fields, not working

// import ODataFile from './SAPodata'; //works

import ODataFile from './ODataTripV4'; //works

import v2tov4 from './v2tov4';
import convert from 'xml-js';
import './App.css';
import { isArray } from 'util';

const App = () => {
  const outXmlString = xslt(ODataFile, v2tov4);
  const options = {
    // attributeNameFn: (val: any) => val.toUpperCase(),
  };
  const schema = convert.xml2js(outXmlString, options).elements;
  // const schema = convert.xml2js(outXmlString, options).elements[0].elements[5]
  // .elements[0].elements;
  console.log(convert.xml2js(outXmlString, options));

  return (
    <div className="App">
      {schema.map((elem: any, index: number) => (
        <Table key={index} data={elem} />
      ))}
    </div>

    // <div>{JSON.stringify(schema)}</div>
  );
};

const Table = ({ data }: { data: any }): JSX.Element => {
  function makeUnique(value: any, index: number, self: any) {
    return self.indexOf(value) === index;
  }
  console.log(data);
  if (!isArray(data.elements)) {
    return <div>{JSON.stringify(data)}</div>;
  }

  const filteredData: any[] = data.elements.filter((el: any) => {
    if (el.name === 'Key' || el.name === 'NavigationProperty') {
      return false;
    }
    return true;
  });

  const columnData = filteredData
    .flatMap((elem: any) => Object.keys(elem.attributes))
    .filter(makeUnique);

  return (
    <table>
      <thead>
        <tr>
          <td colSpan={columnData.length}>{`Entity ${
            data.attributes.Name
          }`}</td>
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
