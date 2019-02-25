import React, { Fragment, useState } from "react";
import { CollapsibleAnnotation } from "./CollapsibleAnnotation";
import { makeUnique } from "../utils";
import { Node } from "../../../types";
import {
  LeftAlignedHeader,
  StyledTable,
  CollapseArrow,
} from "../../styled/styled";
interface Props {
  data: Node;
}

const CollapsibleTable: React.FunctionComponent<Props> = ({ data }) => {
  const attributesColumn: string[] = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  const specialData: string[] = data.children
    .map(
      (elem: Node) =>
        (elem.children && elem.children[0] && elem.children[0].name) || "",
    )
    .filter((elem: string) => !!elem)
    .filter(makeUnique);

  const columnHeaders: string[] = [...attributesColumn, ...specialData];

  return (
    <StyledTable>
      <thead>
        <tr>
          {columnHeaders.map((elem: string, index: number) => (
            <LeftAlignedHeader key={index}>{elem}</LeftAlignedHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.children.map((child: Node, index: number) => {
          const specialHeader: Node = child.children[0];
          if (specialHeader && specialHeader.name === "Collection") {
            const [show, setShow] = useState<boolean>(false);
            return (
              <Fragment key={index}>
                <tr>
                  {columnHeaders.map((el: string, idx: number) => (
                    <td key={idx}>
                      {child.attributes[el] ||
                        (specialHeader && specialHeader.name === el && (
                          <CollapseArrow
                            open={show}
                            clickHandler={() => setShow(!show)}
                          />
                        ))}
                    </td>
                  ))}
                </tr>
                {show && (
                  <tr>
                    <td colSpan={columnHeaders.length}>
                      <CollapsibleAnnotation data={specialHeader} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          }

          return (
            <tr key={index}>
              {columnHeaders.map((el: string, idx: number) => (
                <td key={idx}>
                  {child.attributes[el] ||
                    (specialHeader &&
                      specialHeader.name === el &&
                      specialHeader.value)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export { CollapsibleTable };
