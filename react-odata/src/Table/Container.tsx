import React from 'react';
import ServiceDocumentationTable from './ServiceDocumentationTable';
import TableContainer from './TableContainer';
import { makeUnique } from './utils/utils';
import Table from './Table';
interface IFilteredData {
  name: string;
}

const Container = ({ arg }: { arg: any[] }): JSX.Element => {
  const Documentation: any[] = [];
  const Rest: any[] = [];
  arg.forEach((elem: any) => {
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
        (data: any, idx: number): JSX.Element | null => {
          if (!Array.isArray(data.children)) {
            return <div>{JSON.stringify(data)}</div>;
            //get rid of this later
          }
          if (
            ['EntityContainer', 'Annotation', 'EnumType'].includes(data.name)
          ) {
            // return <div>{JSON.stringify(data)}</div>;
            //get rid of this later
            return null;
          }

          const filteredData: any[] = data.children.filter(
            (el: IFilteredData) => {
              if (
                ['Key', 'NavigationProperty', 'EntityContainer'].includes(
                  el.name,
                )
              ) {
                return false;
              }
              return true;
            },
          );

          const columnData: string[] = filteredData
            .flatMap((elem: { attributes: string }) =>
              Object.keys(elem.attributes),
            )
            .filter(makeUnique);

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

export default Container;
