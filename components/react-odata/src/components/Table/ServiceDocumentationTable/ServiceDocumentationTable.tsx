import React, { Fragment, useState } from "react";
import CollapsibleTable from "./CollapsibleTable";
import { Node } from "../../../types";
interface Props {
  data: Node[];
}
const ServiceDocumentationTable: React.FunctionComponent<Props> = ({ data }) =>
  !Array.isArray(data) ? null : (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>{"Service Documentation / Annotations"}</th>
        </tr>
        <tr>
          <td>{"Target"}</td>
          <td>{"Annotation"}</td>
        </tr>
      </thead>
      <tbody>
        {data.map((value: Node, index: number) => {
          const [show, setShow] = useState<boolean>(false);
          return (
            <Fragment key={index}>
              <tr>
                <td>{value.attributes.Target}</td>
                <td>
                  <button onClick={() => setShow(!show)}>
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
  );

export default ServiceDocumentationTable;
