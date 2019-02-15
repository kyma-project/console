import React from 'react';
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
          return (
            <tr key={index}>
              <td>{value.attributes.Target}</td>
              <td>
                <AnnotationsModal
                  data={value}
                  modalOpeningComponent={<button>{'>'}</button>}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AnnotationsTable;
