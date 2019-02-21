import React, { useState } from "react";
import { Node } from "../../../types";
import { makeUnique } from "../utils";
import SimpleTable from "./SimpleTable";

interface Props {
  data: Node;
}

const CollapsibleAnnotation: React.FunctionComponent<Props> = ({ data }) => {
  const headers = data.children
    .map((child: Node) => child.name)
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
                data={data.children.map((elem: Node) => elem.value)}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CollapsibleAnnotation;
