import styled from 'styled-components';

export const TabTooltip = styled.div`
  visibility: hidden;
  box-sizing: border-box;
  min-width: ${props => (props.minWidth ? props.minWidth : '140px')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : '420px')};
  font-family: 72;
  font-size: 12px;
  color: #ffffff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #32363a;
  text-align: left;
  padding: 6px 10px;
  border-radius: 2px;
  top: 100%;
  left: 50%;
  transform: translate(-20%, -1px);
  position: absolute;
  z-index: 1;
  transition: 0s visibility;

  ::after {
    content: ' ';
    position: absolute;
    bottom: 100%; /* At the top of the tooltip */
    left: 20%;
    margin-left: -4px;
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent #32363a transparent;
  }
`;

export const TabWrapper = styled.li``;
export const TabLink = styled.div`
  display: flex;
  align-items: center;
  margin: 0 15px;
  padding: 19px 0 15px;
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
    ${TabTooltip} {
      visibility: visible;
      transition-delay: 1s;
    }

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
