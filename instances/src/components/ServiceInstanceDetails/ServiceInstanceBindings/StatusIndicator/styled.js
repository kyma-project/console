import styled from 'styled-components';

export const StatusesList = styled.ul`
  margin: 0 0 0 10px;
`;

export const StatusWrapper = styled.li`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#b0b2b4'};
  position: relative;
  border-radius: 50%;
  width: 14px;
  height: 14px;
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
  line-height: 14px;
  font-size: 9px;
  color: #ffffff;
`;
