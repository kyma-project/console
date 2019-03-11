import React from 'react';

import {
  StyledTable,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
  TableBody,
} from '../../styled/styled';

interface Props {
  title: string;
  data: string[];
}

const SimpleTable: React.FunctionComponent<Props> = ({ title, data }) => (
  <StyledTable>
    <TableHead>
      <TableRow>
        <TableHeadCell>{title}</TableHeadCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((elem: string) => (
        <TableRow key={elem}>
          <TableCell>{elem}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </StyledTable>
);

export default SimpleTable;
