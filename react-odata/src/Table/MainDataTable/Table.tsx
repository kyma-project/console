import React from 'react';
import TableHeader from '../styled/TableHeader';
import { Children } from '../../Interfaces';
import { makeUnique } from '../utils';
import CollapsibleRow from './CollapsibleRow';
interface Props {
  columnData: string[];
  title: string;
  filteredData: Children[];
}

const Table = (props: Props): JSX.Element => {
  const { columnData, title, filteredData } = props;

  const annotationsData: string[] = filteredData
    .map(
      (elem: Children) =>
        (elem.children &&
          elem.children.length > 0 &&
          elem.children[0].name !== 'Collection' &&
          elem.children[0].name) ||
        '',
    )
    .filter((elem: string) => !!elem);

  const columnHeaders: string[] = [...columnData, ...annotationsData].filter(
    makeUnique,
  );

  return (
    <table>
      <thead>
        <tr>
          <TableHeader colSpan={columnHeaders.length}>{title}</TableHeader>
        </tr>
        <tr>
          {columnHeaders.map((elem: string, index: number) => (
            <TableHeader key={index}>{elem}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((elem: any, idx: number) => {
          if (elem.children.length > 0) {
            // const [show, setShow] = useState<boolean>(false);
            // return (
            //   <Fragment key={idx}>
            //     <tr key={idx}>
            //       {columnHeaders.map((row: string, index: number) => {
            //         return (
            //           <td key={index}>
            //             {row === 'Annotation' ? (
            //               <button onClick={() => setShow(!show)}>
            //                 {show ? '⇧' : '⇩'}
            //               </button>
            //             ) : (
            //               elem.attributes[row] || elem[row.toLowerCase()] || ''
            //             )}
            //           </td>
            //         );
            //       })}
            //     </tr>
            //     {show && (
            //       <tr>
            //         <td colSpan={columnHeaders.length}>
            //           <HideableSubTable data={elem} />
            //         </td>
            //       </tr>
            //     )}
            //   </Fragment>
            // );
            return <CollapsibleRow data={elem} columnHeaders={columnHeaders} />;
          }
          return (
            <tr key={idx}>
              {columnHeaders.map((row: string, index: number) => {
                return (
                  <td key={index}>
                    {elem.attributes[row] || elem[row.toLowerCase()] || ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
