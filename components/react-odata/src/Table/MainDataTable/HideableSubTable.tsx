import React from 'react';
import { Children } from '../../Interfaces';
import { makeUnique } from '../utils';
import styled from 'styled-components';

const StyledTable = styled.table`
  background-color: #eee;
`;

const HideableSubTable = ({ data }: { data: Children }) => {
  const filteredHeaders = data.children
    .flatMap((elem: any) => {
      return [
        ...Object.keys(elem.attributes),
        ...elem.children.map((child: Children) => child.name),
      ];
    })
    .filter(makeUnique);

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
                  <td key={el}>
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

export default HideableSubTable;
