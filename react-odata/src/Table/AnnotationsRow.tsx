import React from 'react';
import styled from 'styled-components';
interface Props {
  element: { [key: string]: string; attributes: any };
  row: string;
}
const AnnotationsRow = ({ data }: { data: Props }): JSX.Element | null => {
  const { element, row } = data;
  return (
    <td>{data.element.attributes[data.row] || element[row.toLowerCase()]}</td>
  );
};

export default AnnotationsRow;
