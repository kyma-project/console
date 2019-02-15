import React from 'react';
import styled from 'styled-components';
interface Props {
  children: string;
  colSpan?: number;
  width?: string;
}

const StyledTableHeader = styled.td`
  font-weight: bold;
  width:${(props: { width?: string }) => props.width || 'unset'}
  thead > tr:first-child > & {
    text-align: center;
  }
`;

const TableHeader = (props: Props): JSX.Element => (
  <StyledTableHeader colSpan={props.colSpan} width={props.width}>
    {props.children}
  </StyledTableHeader>
);
export default TableHeader;
