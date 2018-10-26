import styled from 'styled-components';

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
`;

export const Item = styled.li`
  padding: 8px 6px;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;

  &:hover {
    background: rgba(243, 244, 245, 0.45);
  }
`;

export const Checkmark = styled.div`
  float: left;
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
  border: solid 1px rgba(63, 80, 96, 0.15);

  &:after {
    content: '\uE05B';
    color: #0b74de;
    opacity: ${props => (props.checked ? '1.0' : '0')};
    transition: opacity ease-out 0.2s;
    position: absolute;
    font-family: SAP-icons;
    font-size: 16px;
    font-style: normal;
    top: 2px;
    left: 4px;
    border-radius: 10px;
  }
`;
