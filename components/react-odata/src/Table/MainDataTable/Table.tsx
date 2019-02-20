import React from "react";
import { Children } from "../../Interfaces";
import { makeUnique } from "../utils";
import CollapsibleRow from "./CollapsibleRow";
interface Props {
  columnData: string[];
  title: string;
  filteredData: Children[];
}

const Table = (props: Props): JSX.Element => {
  const { columnData, title, filteredData } = props;

  const annotationsData: string[] = filteredData
    .map(
      (elem: Children) =>
        (elem.children &&
          elem.children.length > 0 &&
          elem.children[0].name !== "Collection" &&
          elem.children[0].name) ||
        "",
    )
    .filter((elem: string) => !!elem);

  const columnHeaders: string[] = [...columnData, ...annotationsData].filter(
    makeUnique,
  );

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={columnHeaders.length}>{title}</th>
        </tr>
        <tr>
          {columnHeaders.map((elem: string, index: number) => (
            <td key={index}>{elem}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((elem: any, idx: number) => {
          if (elem.children.length > 0) {
            return (
              <CollapsibleRow
                data={elem}
                columnHeaders={columnHeaders}
                key={idx}
              />
            );
          }
          return (
            <tr key={idx}>
              {columnHeaders.map((row: string, index: number) => {
                return (
                  <td key={index}>
                    {elem.attributes[row] || elem[row.toLowerCase()] || ""}
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
