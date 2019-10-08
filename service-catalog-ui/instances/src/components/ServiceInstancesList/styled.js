import styled from 'styled-components';

export const ServiceInstancesWrapper = styled.div`
  border-radius: 4px;
  margin: 30px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
`;

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

export const EmptyList = styled.div`
  width: 100%;
  font-family: '72';
  text-align: center;
  font-size: 20px;
  color: #32363a;
  margin: 50px 0;
`;
