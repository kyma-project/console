import React from 'react';
import TableHeader from './TableHeader';

interface Props {
  columnData: string[];
  title: string;
  filteredData: any[];
}

const Table = (props: Props): JSX.Element => {
  const { columnData, title, filteredData } = props;

  return (
    <table>
      <thead>
        <tr>
          <TableHeader colSpan={columnData.length}>{title}</TableHeader>
        </tr>
        <tr>
          {columnData.map((elem: string, index: number) => (
            <TableHeader key={index}>{elem}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((elem: any, idx: number) => {
          return (
            <tr key={idx}>
              {columnData.map((row: string, index: number) => {
                return (
                  <td key={index}>
                    {elem.attributes[row] || elem[row.toLowerCase()]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
