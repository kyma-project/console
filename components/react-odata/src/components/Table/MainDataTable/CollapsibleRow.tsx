import React, { useState } from "react";
import { Node } from "../../../types";
import { HideableSubTable } from "./HideableSubTable";
import { CollapseArrow } from "../../styled/styled";

interface Props {
  columnHeaders: string[];
  data: Node & { [key: string]: string };
}

const CollapsibleRow: React.FunctionComponent<Props> = ({
  columnHeaders,
  data,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <tr>
        {columnHeaders.map((row: string, index: number) => (
          <td key={index}>
            {row === "Annotation" ? (
              <CollapseArrow open={show} clickHandler={() => setShow(!show)} />
            ) : (
              data.attributes[row] || data[row.toLowerCase()] || ""
            )}
          </td>
        ))}
      </tr>
      {show && (
        <tr>
          <td colSpan={columnHeaders.length}>
            <HideableSubTable data={data} />
          </td>
        </tr>
      )}
    </>
  );
};

export { CollapsibleRow };
