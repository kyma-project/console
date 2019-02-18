import React from 'react';
import { Children } from './../../Interfaces';
import { makeUnique } from './../utils/utils';
import styled from 'styled-components';

const StyledTable = styled.table`
  background-color: #eee;
`;

const CollapsibleRow = ({ data }: { data: Children }) => {
  const filteredHeaders = data.children
    .flatMap((elem: any) => {
      console.log(elem);
      return [
        ...Object.keys(elem.attributes),
        ...elem.children.map((child: Children) => child.name),
      ];
    })
    .filter(makeUnique);
  //   console.log(data);
  //   console.log(data.children.map((child: Children) => child));
  //   console.log(filteredHeaders);
  return (
    <StyledTable>
      <thead>
        <tr>
          {filteredHeaders.map((arg: string) => <td key={arg}>{arg}</td>)}
        </tr>
      </thead>
      <tbody>
        {data.children.map((elem: Children, index: number) => {
          return (
            <tr key={index}>
              {filteredHeaders.map((el: string) => {
                return (
                  <td>
                    {elem.attributes[el] ||
                      (elem.children.length > 0 && elem.children[0].value)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default CollapsibleRow;
