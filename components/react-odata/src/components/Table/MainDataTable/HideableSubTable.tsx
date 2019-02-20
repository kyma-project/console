import React from "react";
import { Node } from "../../../types";
import { makeUnique } from "../utils";
import { StyledTable, LeftAlignedHeader } from "../styled/styled";

interface Props {
  data: Node;
}

const HideableSubTable: React.FunctionComponent<Props> = ({ data }) => {
  const filteredHeaders = data.children
    .flatMap((elem: any) => [
      ...Object.keys(elem.attributes),
      ...elem.children.map((child: Node) => child.name),
    ])
    .filter(makeUnique);

  return (
    <StyledTable>
      <thead>
        <tr>
          {filteredHeaders.map((arg: string) => (
            <LeftAlignedHeader key={arg}>{arg}</LeftAlignedHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.children.map((elem: Node, index: number) => (
          <tr key={index}>
            {filteredHeaders.map((el: string) => (
              <td key={el}>
                {elem.attributes[el] ||
                  (elem.children[0] && elem.children[0].value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default HideableSubTable;
