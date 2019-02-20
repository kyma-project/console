import React, { useState } from "react";
import { Child } from "../../types";
import { makeUnique } from "../utils";
import SimpleTable from "./SimpleTable";

interface Props {
  data: Child;
}

const CollapsibleAnnotation: React.FunctionComponent<Props> = ({
  data,
}): JSX.Element => {
  const headers = data.children
    .map((child: Child) => child.name)
    .filter(makeUnique);

  const [show, useShow] = useState<boolean>(false);

  return (
    <table>
      <thead>
        <tr>
          <td>{headers[0] || "Data"}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <button onClick={() => useShow(!show)}>{show ? "⇧" : "⇩"}</button>
          </td>
        </tr>
        {show && (
          <tr>
            <td>
              <SimpleTable
                title="Text"
                data={data.children.map((elem: Child) => elem.value)}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CollapsibleAnnotation;
