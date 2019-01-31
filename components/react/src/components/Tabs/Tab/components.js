import styled from 'styled-components';

export const TabWrapper = styled.li``;

export const TabLink = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;
  padding: 21px 0 20px;
  border: none;
  position: relative;
  color: ${props => (props.active ? '#0a6ed1' : '#32363b')};
  font-size: 14px;
  outline: none;
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
