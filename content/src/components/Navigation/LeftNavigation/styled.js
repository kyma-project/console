import styled from 'styled-components';

export const GoBack = styled.div`
  margin: 0;
  color: #51555a;
  display: block;
  font-weight: 400;
  padding: 10px 20px 10px 20px;
  font-size: 14px;
  line-height: 20px;
  text-transform: inherit;
  transition: all 125ms ease-in;

  [class^='sap-icon--'] {
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
    background-color: #fafafa;
    color: #085caf;
  }
`;
