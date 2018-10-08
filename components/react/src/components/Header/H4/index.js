import styled from 'styled-components';
import { media } from '../../../commons';

const H4 = styled.h4`
  font-size: 1.125em;
  line-height: 1.11111111;

  ${media.desktop`
    line-height: 1.22222222;
  `};
`;

export default H4;
