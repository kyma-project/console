import React, { useState } from "react";
import ServiceDocumentationTable from "./ServiceDocumentationTable/ServiceDocumentationTable";
import { Node } from "../../types";
import { makeUnique } from "./utils";
import Table from "./MainDataTable/Table";
import { CollapseButton } from "../styled/styled";

interface Props {
  arg: Node[];
}

const CHILDREN_TO_IGNORE: string[] = [
  "Key",
  "NavigationProperty",
  "EntityContainer",
  "Annotation",
];

const TABLES_TO_IGNORE: string[] = [
  "EntityContainer",
  "EnumType",
  "Annotation",
];

const TableContainer: React.FunctionComponent<Props> = ({ arg }) => {
  const Documentation: Node[] = [];
  const Rest: Node[] = [];
  arg.forEach((elem: Node) => {
    if (elem.name === "Annotations") {
      Documentation.push(elem);
    } else {
      Rest.push(elem);
    }
  });

  const [showAll, setShowAll] = useState<boolean>(true);

  return (
    <>
      <CollapseButton open={showAll} onClick={() => setShowAll(!showAll)}>
        {showAll ? "Collapse" : "Expand"}
      </CollapseButton>

      {Documentation && Documentation.length > 0 && (
        <ServiceDocumentationTable showAll={showAll} data={Documentation} />
      )}
      {Rest.map((data: Node, idx: number) => {
        if (!Array.isArray(data.children)) {
          return null;
        }

        if (TABLES_TO_IGNORE.includes(data.name)) {
          return null;
        }

        const filteredData: any[] = data.children.filter(
          (el: Node) => !CHILDREN_TO_IGNORE.includes(el.name),
        );

        const columnData: string[] = filteredData
          .flatMap((elem: { attributes: string }) =>
            Object.keys(elem.attributes),
          )
          .filter((elem: string, index: number, self: string[]) =>
            elem === "Term" ? false : makeUnique(elem, index, self),
          );

        const title = `${data.name || "Entity"} ${data.attributes.Name ||
          data.attributes.Term ||
          data.attributes.Target}`;

        return (
          <Table
            key={idx}
            columnData={columnData}
            title={title}
            showAll={showAll}
            filteredData={filteredData}
          />
        );
      })}
    </>
  );
};

export default TableContainer;
