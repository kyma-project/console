import React from 'react';
import ServiceDocumentationTable from './ServiceDocumentationTable';
import { Children } from '../Interfaces';
import { makeUnique } from './utils/utils';
import Table from './MainDataTable/Table';

const TableContainer = ({ arg }: { arg: Children[] }): JSX.Element => {
  const Documentation: Children[] = [];
  const Rest: Children[] = [];
  arg.forEach((elem: Children) => {
    if (elem.name === 'Annotations') {
      Documentation.push(elem);
    } else {
      Rest.push(elem);
    }
  });

  return (
    <>
      {Documentation &&
        Documentation.length > 0 && (
          <ServiceDocumentationTable data={Documentation} />
        )}
      {Rest.map(
        (data: Children, idx: number): JSX.Element | null => {
          if (!Array.isArray(data.children)) {
            return <div>{JSON.stringify(data)}</div>;
            //get rid of this later
          }

          if (
            ['EntityContainer', 'EnumType', 'Annotation'].includes(data.name)
          ) {
            // return <div>{JSON.stringify(data)}</div>;
            //get rid of this later
            return null;
          }

          const filteredData: any[] = data.children.filter(
            (el: Children) =>
              ![
                'Key',
                'NavigationProperty',
                'EntityContainer',
                'Annotation',
              ].includes(el.name),
          );

          const columnData: string[] = filteredData
            .flatMap((elem: { attributes: string }) =>
              Object.keys(elem.attributes),
            )
            .filter(
              (elem: string, index: number, self: string[]) =>
                elem === 'Term' ? false : makeUnique(elem, index, self),
            );

          const title = `${data.name || 'Entity'} ${data.attributes.Name ||
            data.attributes.Term ||
            data.attributes.Target}`;

          return (
            <Table
              key={idx}
              columnData={columnData}
              title={title}
              filteredData={filteredData}
            />
          );
        },
      )}
    </>
  );
};

export default TableContainer;
