import React, { useState, Fragment } from 'react';
import AnnotationsModal from './AnnotationsModal';
import TableHeader from './TableHeader';
interface Props {
  data: any[];
}
const AnnotationsTable = (props: Props): JSX.Element | null => {
  const { data } = props;

  if (!Array.isArray(data)) {
    return <div>{JSON.stringify(data)}</div>;
    //get rid of this later
    //return null
  }

  return (
    <table>
      <thead>
        <tr>
          <TableHeader colSpan={2}>
            {'Service Documentation / Annotations'}
          </TableHeader>
        </tr>
        <tr>
          <TableHeader>{'Target'}</TableHeader>
          <TableHeader width={'150px'}>{'Annotation'}</TableHeader>
        </tr>
      </thead>
      <tbody>
        {data.map((value: any, index: number) => {
          const [open, setOpen] = useState<boolean>(false);
          return (
            <Fragment key={index}>
              <tr>
                <td>{value.attributes.Target}</td>
                <td>
                  <button onClick={() => setOpen(!open)}>
                    {open ? '⇧' : '⇩'}
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <AnnotationsModal open={open} data={value} />
                </td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default AnnotationsTable;
