import styled from 'styled-components';

const Text = styled.p`
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  color: ${props => (props.color ? props.color : '#515559')};
  line-height: ${props => (props.lineHeight ? props.lineHeight : '1.57')};
  margin: 0;
`;

export default Text;
