import styled from 'styled-components';

export const SelectWrapper = styled.div`
  position relative;
  width: auto;
  height: auto;
`;

export const SelectField = styled.select`
  padding: 0 32px 0 10px;
  font-size: 14px;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  border: solid 1px rgba(50, 54, 58, 0.15);
  outline: none;
  transition: border-color ease-out 0.2s;

  &:hover {
    border: 1px solid #2196f3;
  }

  &:focus {
    border: 1px solid #2196f3;
  }
`;
