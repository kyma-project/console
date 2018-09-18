import styled from 'styled-components';

export const SearchBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 36px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  border: ${props =>
    props.darkBorder
      ? 'solid 1px rgba(50, 54, 58, 0.55)'
      : 'solid 1px rgba(50, 54, 58, 0.15)'};
  font-style: italic;
  text-align: left;
  color: #32363b;
  position: relative;
`;

export const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  border: none;
  padding: 10px;
  background-color: transparent;
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  color: #32363b;
  display: inline-block;
  margin: 0;

  &::-webkit-input-placeholder {
    font-style: italic;
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.div`
  width: 20px;
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background-color: transparent;
  color: #0a6ed1;

  &:focus {
    outline: none;
  }

  &::before {
    content: ${props => (props.noIcon ? "''" : "'\uE00D'")};
    position: absolute;
    font-family: SAP-icons;
    font-size: 16px;
    font-style: normal;
    pointer-events: none;
    right: 10px;
    top: 9px;
  }
`;
