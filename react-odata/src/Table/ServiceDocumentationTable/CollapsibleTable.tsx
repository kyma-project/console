import React, { Fragment, useState } from "react";
import styled from "styled-components";
import CollapsedAnnotation from "./CollapsibleAnnotation";
import { makeUnique } from "../utils";
import { Children } from "../../Interfaces";

const CollapsedTable = ({ data }: { data: Children }): JSX.Element => {
  const attributesColumn: string[] = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  const specialData: string[] = data.children
    .map(
      (elem: Children) =>
        (elem.children && elem.children.length > 0 && elem.children[0].name) ||
        "",
    )
    .filter((elem: string) => !!elem)
    .filter(makeUnique);

  const columnHeaders: string[] = [...attributesColumn, ...specialData];

  return (
    <StyledTable>
      <thead>
        <tr>
          {columnHeaders.map((elem: string | false, index: number) => (
            <StyledHeader key={index}>{elem}</StyledHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.children.map((child: Children, index: number) => {
          const specialHeader: Children = child.children[0];
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
                      <CollapsedAnnotation data={specialHeader} />
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

export default CollapsedTable;

const StyledTable = styled.table`
  background-color: #eee;
  width: 100%;
  max-width: 100%;
`;

const StyledHeader = styled.th`
  text-align: left;
`;
