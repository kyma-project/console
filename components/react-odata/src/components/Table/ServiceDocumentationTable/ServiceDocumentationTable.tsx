import React, { Fragment, useState } from "react";
import { CollapsibleTable } from "./CollapsibleTable";
import { Node } from "../../../types";

import {
  TableHeader,
  TableWrapper,
  CollapseArrow,
  TableHeaderWrapper,
} from "../../styled/styled";
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
      <TableHeaderWrapper className="asdfg">
        <TableHeader>{"Service Documentation / Annotations"}</TableHeader>
        <CollapseArrow
          open={showAll}
          clickHandler={() => {
            if (showAll) {
              setShowPart(Array(data.length).fill(false));
            }
            setShowAll(!showAll);
          }}
        />
      </TableHeaderWrapper>

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
                      <CollapseArrow
                        open={show}
                        clickHandler={() =>
                          setShowPart(inverseArrayValue(showPart, index))
                        }
                      />
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
