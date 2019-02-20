import React, { useState } from "react";
import { Child } from "../../types";
import HideableSubTable from "./HideableSubTable";

interface Props {
  columnHeaders: string[];
  data: Child & { [key: string]: string };
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
              <button onClick={() => setShow(!show)}>{show ? "⇧" : "⇩"}</button>
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

export default CollapsibleRow;
