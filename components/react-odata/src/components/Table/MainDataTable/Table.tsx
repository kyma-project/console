import React, { useState, useEffect, useRef } from "react";
import { Node } from "../../../types";
import { makeUnique } from "../utils";
import CollapsibleRow from "./CollapsibleRow";
import { PanelActions, PanelHead } from "fundamental-react";

import {
  StyledTable,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  TableWrapper,
  CollapseArrow,
  TableHeaderWrapper,
  TablePanel,
  TableBody,
} from "../../styled/styled";

interface Props {
  columnData: string[];
  title: string;
  filteredData: Node[];
  showAll: boolean;
}

const Table: React.FunctionComponent<Props> = ({
  columnData,
  title,
  filteredData,
  showAll,
}) => {
  const annotationsData: string[] = filteredData
    .map(
      (elem: Node) =>
        (elem.children &&
          elem.children.length > 0 &&
          elem.children[0].name !== "Collection" &&
          elem.children[0].name) ||
        "",
    )
    .filter((elem: string) => !!elem);

  const columnHeaders: string[] = [...columnData, ...annotationsData].filter(
    makeUnique,
  );

  function usePrevious(value: boolean) {
    const ref = useRef<boolean>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const [show, setShow] = useState<boolean>(showAll);

  const prevShowAll = usePrevious(showAll);

  useEffect(() => {
    if (prevShowAll !== undefined && prevShowAll !== showAll) {
      setShow(showAll);
    }
  }, [prevShowAll, showAll]);

  return (
    <TableWrapper>
      <TablePanel>
        <TableHeaderWrapper onClick={() => setShow(!show)}>
          <PanelHead title={title} />
          <PanelActions>
            <CollapseArrow open={show} clickHandler={() => setShow(!show)} />
          </PanelActions>
        </TableHeaderWrapper>
        {show && (
          <StyledTable>
            <TableHead>
              <TableRow>
                {columnHeaders.map((elem: string, index: number) => (
                  <TableHeadCell key={index}>{elem}</TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((elem: any, idx: number) =>
                elem.children.length > 0 ? (
                  <CollapsibleRow
                    data={elem}
                    columnHeaders={columnHeaders}
                    key={idx}
                  />
                ) : (
                  <TableRow key={idx}>
                    {columnHeaders.map((row: string, index: number) => (
                      <TableCell key={index}>
                        {elem.attributes[row] || elem[row.toLowerCase()] || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )}
            </TableBody>
          </StyledTable>
        )}
      </TablePanel>
    </TableWrapper>
  );
};

export default Table;
