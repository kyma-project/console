import styled from 'styled-components';

const Separator = styled.div`
  box-sizing: border-box;
  display: block;
  height: ${props => (props.height ? props.height : '1px')};
  opacity: 0.1;
  background-color: #000000;
  margin: ${props => (props.margin ? props.margin : '0')};
`;

export default Separator;
