import React from 'react';
import { Node } from '../../../types';
import { makeUnique } from '../utils';
import {
  StyledTable,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../styled/styled';

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
      <TableHead>
        <TableRow>
          {filteredHeaders.map((arg: string) => (
            <TableHeadCell key={arg}>{arg}</TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.children.map((elem: Node, index: number) => (
          <TableRow key={index}>
            {filteredHeaders.map((el: string) => (
              <TableCell key={el}>
                {elem.attributes[el] ||
                  (elem.children[0] && elem.children[0].value)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
};

export default HideableSubTable;
