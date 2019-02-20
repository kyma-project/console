import React, { Fragment, useState } from "react";
import CollapsibleAnnotation from "./CollapsibleAnnotation";
import { makeUnique } from "../utils";
import { Child } from "../../types";
import { LeftAlignedHeader, StyledTable } from "./../styled/styled";
interface Props {
  data: Child;
}

const CollapisbleTable: React.FunctionComponent<Props> = ({
  data,
}): JSX.Element => {
  const attributesColumn: string[] = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  const specialData: string[] = data.children
    .map(
      (elem: Child) =>
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
        {data.children.map((child: Child, index: number) => {
          const specialHeader: Child = child.children[0];
          if (specialHeader && specialHeader.name === "Collection") {
            const [show, setShow] = useState<boolean>(false);
            return (
              <Fragment key={index}>
                <tr>
                  {columnHeaders.map((el: string, idx: number) => (
                    <td key={idx}>
                      {child.attributes[el] ||
                        (specialHeader && specialHeader.name === el && (
                          <button onClick={() => setShow(!show)}>
                            {show ? "⇧" : "⇩"}
                          </button>
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

export default CollapisbleTable;
