import styled from 'styled-components';
import { media } from '../../../commons';

const H3 = styled.h3`
  font-size: 1.375em;
  line-height: 1.13636364;

  ${media.giant`
    font-size: 1.75em;
    line-height: 1.25;
  `} ${media.desktop`
    font-size: 1.5em;
    line-height: 1.25;
  `};
`;

export default H3;
