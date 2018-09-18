import styled from 'styled-components';

export const RelativeWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownWrapper = styled.div`
  margin-top: ${props => (props.arrowTop ? '5px' : '0')};
  position: absolute;
  right: 0;
  padding: 6px;
  min-width: 200px;
  background: #fff;
  border-radius: 4px;
  color: #32363a;
  z-index: 10;
  display: ${props => (props.visible ? 'block' : 'none')};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 14px 0 rgba(0, 0, 0, 0.1);

  &:before {
    ${props => (props.arrowTop ? 'content: "";' : '')};
    position: absolute;
    right: 20px;
    top: -6px;
    display: inline-block;
    background: transparent;
    border-top: 0 solid transparent;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    border-bottom: 7px solid #fff;
    width: 0;
    height: 0;
    z-index: 9;
  }
`;
