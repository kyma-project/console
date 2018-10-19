import styled from 'styled-components';

export const CheckboxWrapper = styled.label`
  font-family: 72;
  font-size: 14px;
  line-height: 1.57;
  text-align: left;
  color: #515559;
  word-break: break-all;
`;
export const TextWrapper = styled.div`
  font-family: 72;
  font-size: 14px;
  line-height: 1.57;
  text-align: left;
  color: #515559;
  word-break: break-all;
  display: ${props => (props.flex ? 'flex' : 'block')};
`;

export const Text = styled.p`
  color: ${props => (props.warning ? '#ee0000' : '#515559')};
  font-weight: ${props => (props.bold ? 'bold' : '')};
  margin-bottom: 20px;
  margin: ${props => (props.margin ? props.margin : '0 0 20px 0')};
  width: ${props => props.width};
`;

export const CheckboxInput = styled.input`
  margin-right: 10px;
  position: relative;
  top: -1px;
`;

export const WarningText = styled.div`
  margin: 10px 0 20px 25px;
  font-family: 72;
  font-size: 12px;
  line-height: 1.57;
  text-align: left;
  color: ${props => (props.checked ? '#ee0000' : '#b0b2b4')};
  word-break: normal;
  transition: color ease-out 0.2s;
`;

export const IconWrapper = styled.span`
  display: inline-block;
  position: relative;
  top: 1px;
`;
