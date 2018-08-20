import styled from 'styled-components';

export const CreateBindingButton = styled.button`
  padding: 0;
  background: none;
  border: 0;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: right;
  margin-right: 0;
  color: #0a6ed1;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  text-decoration: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const WarningText = styled.p`
  margin: 6px 0 0 0;
  font-family: 72;
  font-size: 14px;
  line-height: 1.57;
  text-align: left;
  color: #ee0000;
  word-break: normal;
  transition: color ease-out 0.2s;
`;

export const IconWrapper = styled.span`
  display: inline-block;
  position: relative;
  top: 1px;
`;
