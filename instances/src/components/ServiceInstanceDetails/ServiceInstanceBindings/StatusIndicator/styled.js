import styled from 'styled-components';

export const StatusWrapper = styled.div`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#b0b2b4'};
  position: relative;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-left: 10px;
  border: none;
  overflow: hidden;
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
  line-height: 16px;
  font-size: 10px;
  color: #ffffff;
`;
