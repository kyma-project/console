import styled from 'styled-components';

export const TabLink = styled.li`
  margin: 0 15px;
  padding: 19px 0 15px;
  border: none;
  position: relative;
  color: ${props => (props.active ? '#0a6ed1' : '#32363b')};
  font-size: 14px;
  outline: none;
  display: inline-block;
  transition: 0.2s color linear;
  cursor: pointer;

  &:first-letter {
    text-transform: uppercase;
  }

  &:after {
    content: '';
    bottom: 0;
    display: block;
    position: absolute;
    height: ${props => (props.active ? '3px' : '0px')};
    width: 100%;
    border-radius: 2px;
    background-color: #0b74de;
  }

  &:hover {
    color: #0a6ed1;
    cursor: pointer;

    &:after {
      content: '';
      bottom: 0;
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      border-radius: 2px;
      background-color: #0b74de;
    }
  }
`;
