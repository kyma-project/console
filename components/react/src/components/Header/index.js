import styled from 'styled-components';
import { media } from '../../commons';

const Header = styled.header`
  font-size: 100%;
  font-size-adjust: 0.5;
  font-weight: normal;
  color: #32363a;
  margin: ${props => (props.margin ? props.margin : '0')};
`;

export default Header;
