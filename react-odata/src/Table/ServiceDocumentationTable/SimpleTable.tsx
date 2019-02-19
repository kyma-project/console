import React from 'react';
import styled from 'styled-components';
const StyledHeader = styled.th`
  text-align: left;
`;

const SimpleTable = ({
  title,
  data,
}: {
  title: string;
  data: string[];
}): JSX.Element => {
  return (
    <table>
      <thead>
        <tr>
          <StyledHeader>{title}</StyledHeader>
        </tr>
      </thead>
      <tbody>
        {data.map((elem: string) => (
          <tr key={elem}>
            <td>{elem}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
