import React, { useState } from "react";
import { Node } from "../../../types";
import { makeUnique } from "../utils";
import SimpleTable from "./SimpleTable";
import {
  CollapseArrow,
  StyledTable,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "./../../styled/styled";
interface Props {
  data: Node;
}

const CollapsibleAnnotation: React.FunctionComponent<Props> = ({ data }) => {
  const headers = data.children
    .map((child: Node) => child.name)
    .filter(makeUnique);

  const [show, useShow] = useState<boolean>(false);

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableHeadCell>{headers[0] || "Data"}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <CollapseArrow open={show} clickHandler={() => useShow(!show)} />
          </TableCell>
        </TableRow>
        {show && (
          <TableRow>
            <TableCell>
              <SimpleTable
                title="Text"
                data={data.children.map((elem: Node) => elem.value)}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </StyledTable>
  );
};

export default CollapsibleAnnotation;
