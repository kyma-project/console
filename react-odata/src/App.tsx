import React, { Component } from 'react';
import xslt from 'xslt';
// import XMLParser from 'react-xml-parser';
import ODataFile from './ODataFile';
// import ODataGorn from './ODataGorn'; //V1 :v it's too old
import v2tov4 from './v2tov4';
import convert from 'xml-js';
import './App.css';

class App extends Component {
  render() {
    const outXmlString = xslt(ODataFile, v2tov4);
    const options = {
      // attributeNameFn: (val: any) => val.toUpperCase(),
    };
    const schema = convert.xml2js(outXmlString, options).elements;

    return (
      <div className="App">
        {schema[0].elements.map((elem: any, index: number) => (
          <Table key={index} data={elem} />
        ))}
      </div>
    );
  }
}

const Table = ({ data }: { data: any }): JSX.Element => {
  function makeUnique(value: any, index: number, self: any) {
    return self.indexOf(value) === index;
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

const Header = ({
  span,
  children,
}: {
  span?: number;
  children?: JSX.Element | string;
}): JSX.Element => <th colSpan={span}>{children}</th>;

export default App;
