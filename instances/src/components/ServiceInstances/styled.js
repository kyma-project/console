import styled from 'styled-components';

export const ServiceInstancesWrapper = styled.div`
  border-radius: 4px;
  margin: 30px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
`;

export const StatusWrapper = styled.div`
  background-color: #6d7678;
  position: relative;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  border: none;
  overflow: hidden;
  float: left;

  &:first-child {
    margin-left: 0;
  }
`;

export const Status = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  border: none;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  font-family: '72';
  line-height: 20px;
  font-size: 12px;
  color: #ffffff;
`;
