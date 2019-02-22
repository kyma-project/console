import React, { Fragment, useState } from "react";
import { CollapsibleTable } from "./CollapsibleTable";
import { Node } from "../../../types";

import { TableHeader, TableWrapper } from "../../styled/styled";
interface Props {
  data: Node[];
}

const inverseArrayValue = (arr: boolean[], index: number) => {
  const data: boolean[] = [...arr];
  data[index] = !data[index];
  return data;
};

const ServiceDocumentationTable: React.FunctionComponent<Props> = ({
  data,
}) => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showPart, setShowPart] = useState<boolean[]>(
    Array(data.length).fill(false),
  );

  return !Array.isArray(data) ? null : (
    <TableWrapper>
      <button
        onClick={() => {
          if (showAll) {
            setShowPart(Array(data.length).fill(false));
          }
          setShowAll(!showAll);
        }}
      >
        Show/Hide
      </button>
      <TableHeader>{"Service Documentation / Annotations"}</TableHeader>
      {showAll && (
        <table>
          <thead>
            <tr>
              <td>{"Target"}</td>
              <td>{"Annotation"}</td>
            </tr>
          </thead>
          <tbody>
            {data.map((value: Node, index: number) => {
              const show = showPart[index];
              return (
                <Fragment key={index}>
                  <tr>
                    <td>{value.attributes.Target}</td>
                    <td>
                      <button
                        onClick={() =>
                          setShowPart(inverseArrayValue(showPart, index))
                        }
                      >
                        {show ? "⇧" : "⇩"}
                      </button>
                    </td>
                  </tr>
                  {show && (
                    <tr>
                      <td colSpan={2}>
                        <CollapsibleTable data={value} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </TableWrapper>
  );
};

export { ServiceDocumentationTable };
