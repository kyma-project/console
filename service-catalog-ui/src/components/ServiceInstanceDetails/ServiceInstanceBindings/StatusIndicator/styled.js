import styled from 'styled-components';

export const StatusesList = styled.ul`
  margin: 0 0 0 10px;
  align-items: center;
  display: grid;
  grid-gap: 3px;
`;

export const StatusWrapper = styled.li`
  grid-row: 1;
  &:first-child {
    margin-left: 0;
  }
`;
