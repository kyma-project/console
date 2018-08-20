import styled from 'styled-components';

const Text = styled.p`
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  color: #515559;
  line-height: 1.57;
  margin: 0;
`;

export default Text;
