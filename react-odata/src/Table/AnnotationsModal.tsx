import React from 'react';
import styled from 'styled-components';

import { makeUnique } from './utils/utils';
interface Props {
  open?: boolean;
  data: any;
}
const StyledTable = styled.table`
  background-color: #eee;
  ${(props: { open?: boolean }) => !props.open && 'display: none'};
  width: 100%;
`;

const AnnotationsModal = (props: Props): JSX.Element => {
  const { data, open } = props;

  const attributesColumn = data.children
    .flatMap((elem: { attributes: any }) => Object.keys(elem.attributes))
    .filter(makeUnique);

  const specialData = data.children
    .map((elem: any) => {
      return elem.children && elem.children.length > 0 && elem.children[0].name;
    })
    .filter((elem: any) => !!elem)
    .filter(makeUnique);
  const columnHeaders = [...attributesColumn, ...specialData];

  return (
    <StyledTable open={open}>
      <thead>
        <tr>
          {columnHeaders.map((elem: string, index: number) => (
            <th key={index}>{elem}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.children.map((child: any, index: number) => {
          const specialHeader = child.children[0];
          return (
            <tr key={index}>
              {columnHeaders.map((el: any, idx: number) => {
                return (
                  <th key={idx}>
                    {child.attributes[el] ||
                      (specialHeader &&
                        specialHeader.name === el &&
                        specialHeader.value)}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
};

export default AnnotationsModal;
