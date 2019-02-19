import React, { useState } from 'react';
import { Children } from '../../Interfaces';
import { makeUnique } from '../utils';
import SimpleTable from './SimpleTable';
const CollapsedAnnotation = ({ data }: { data: Children }): JSX.Element => {
  const headers = data.children
    .map((child: Children) => child.name)
    .filter(makeUnique);
  if (headers.length > 1) {
    //so far I've seen only headers with length 1, e.g. "string" in XOData
    console.error('Take care of this issue');
  }

  const [show, useShow] = useState<boolean>(false);
  return (
    <table>
      <thead>
        <tr>
          <td>{headers[0]}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <button onClick={() => useShow(!show)}>{show ? '⇧' : '⇩'}</button>
          </td>
        </tr>
        {show && (
          <tr>
            <td>
              <SimpleTable
                title={'Text'}
                data={data.children.map((elem: Children) => elem.value)}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CollapsedAnnotation;
