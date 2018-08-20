import styled from 'styled-components';

export const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: ${props => (props.noBottomMargin ? '0' : '16px')};
`;

export const FieldLabel = styled.label`
  width: 100%;
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #32363b;
  margin-bottom: 6px;
  display: block;
`;

export const FieldIcon = styled.span`
  display: block;
  font-family: SAP-Icons;
  line-height: 1.14;
  font-size: 14px;
  color: ${props =>
    (props.isError && '#ee0000') ||
    (props.isWarning && '#ffeb3b') ||
    (props.isSuccess && '#4caf50') ||
    '#32363b'};
  position: absolute;
  top: 10px;
  right: ${props => (props.isPassword ? '30px' : '10px')};
  opacity: ${props => (props.visible ? '1' : '0')};
  transition: opacity ease-out 0.2s;
`;

export const FieldMessage = styled.p`
  font-family: '72';
  font-size: 12px;
  min-height: 24px;
  font-weight: normal;
  margin: 8px 0 0 0;
  display: block;
  color: ${props =>
    (props.isError && '#ee0000') ||
    (props.isWarning && '#ffeb3b') ||
    (props.isSuccess && '#4caf50') ||
    '#32363b'};
  opacity: ${props => (props.visible ? '1' : '0')};
  transition: opacity ease-out 0.2s;
`;

export const FieldRequired = styled.span`
  padding-left: 3px;
  color: #ee0000;
`;
