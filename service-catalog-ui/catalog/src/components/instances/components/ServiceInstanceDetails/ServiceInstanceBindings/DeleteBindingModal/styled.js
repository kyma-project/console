import styled from 'styled-components';

export const TextWrapper = styled.div`
  font-family: 72;
  font-size: 14px;
  line-height: 1.57;
  text-align: left;
  color: #515559;
  display: ${props => (props.flex ? 'flex' : 'block')};
`;

export const Text = styled.p`
  color: ${props => (props.warning ? '#ee0000' : '#515559')};
  font-weight: ${props => (props.bold ? 'bold' : '')};
  margin-bottom: 20px;
  margin: ${props => (props.margin ? props.margin : '0 0 20px 0')};
  width: ${props => props.width};
`;

export const Bold = styled.span`
  font-weight: bold;
`;
