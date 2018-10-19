import styled from 'styled-components';

export const BindApplicationButton = styled.button`
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

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none !important;
  margin: 10px 0 0;
`;

export const SubSectionTitle = styled.p`
  margin: ${props => props.margin || '10px 0'};
  font-weight: ${props => (props.bold ? 'bold' : ' ')};
  line-height: 1.14;
  color: #32363b;
`;

export const SubSectionDescription = styled.p`
  margin: ${props => props.margin || '0 0 20px'};
  line-height: 1.57;
  color: #515559;
`;
