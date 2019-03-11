import React, { useState } from 'react';
import { Node } from '../../../types';
import HideableSubTable from './HideableSubTable';
import { CollapseArrow, TableCell, TableRow } from '../../styled/styled';

interface Props {
  columnHeaders: string[];
  data: Node & { [key: string]: string };
}

const CollapsibleRow: React.FunctionComponent<Props> = ({
  columnHeaders,
  data,
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <TableRow>
        {columnHeaders.map((row: string, index: number) => (
          <TableCell key={index}>
            {row === 'Annotation' ? (
              <CollapseArrow open={show} clickHandler={() => setShow(!show)} />
            ) : (
              data.attributes[row] || data[row.toLowerCase()] || ''
            )}
          </TableCell>
        ))}
      </TableRow>
      {show && (
        <TableRow>
          <TableCell colSpan={columnHeaders.length}>
            <HideableSubTable data={data} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default CollapsibleRow;
