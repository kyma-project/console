import styled from 'styled-components';

export const RelativeWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownWrapper = styled.div`
  position: absolute;
  right: 0;
  display: block;
  padding: 6px;
  width: 200px;
  background: #fff;
  border-radius: 4px;
  color: #32363a;
  z-index: 10;
  display: ${props => (props.visible ? 'block' : 'none')};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 2px 14px 0 rgba(0, 0, 0, 0.1);
`;
