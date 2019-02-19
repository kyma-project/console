import React, { useState, Fragment } from 'react';
import { Children } from '../../Interfaces';
import HideableSubTable from './HideableSubTable';

const CollapsibleRow = ({
  columnHeaders,
  data,
}: {
  columnHeaders: string[];
  data: Children & { [key: string]: string };
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <Fragment>
      <tr>
        {columnHeaders.map((row: string, index: number) => {
          return (
            <td key={index}>
              {row === 'Annotation' ? (
                <button onClick={() => setShow(!show)}>
                  {show ? '⇧' : '⇩'}
                </button>
              ) : (
                data.attributes[row] || data[row.toLowerCase()] || ''
              )}
            </td>
          );
        })}
      </tr>
      {show && (
        <tr>
          <td colSpan={columnHeaders.length}>
            <HideableSubTable data={data} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default CollapsibleRow;
