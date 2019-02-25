import React from "react";
import { Node } from "../../../types";
import { makeUnique } from "../utils";
import CollapsibleRow from "./CollapsibleRow";
interface Props {
  columnData: string[];
  title: string;
  filteredData: Node[];
}

const Table: React.FunctionComponent<Props> = ({
  columnData,
  title,
  filteredData,
}) => {
  const annotationsData: string[] = filteredData
    .map(
      (elem: Node) =>
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
        {filteredData.map((elem: any, idx: number) =>
          elem.children.length > 0 ? (
            <CollapsibleRow
              data={elem}
              columnHeaders={columnHeaders}
              key={idx}
            />
          ) : (
            <tr key={idx}>
              {columnHeaders.map((row: string, index: number) => (
                <td key={index}>
                  {elem.attributes[row] || elem[row.toLowerCase()] || ""}
                </td>
              ))}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};

export default Table;
