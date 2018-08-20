import styled from 'styled-components';
import { rem } from 'polished';
import { media } from '../../../commons';

const H1 = styled.h1`
  font-size: 2em;
  line-height: 1.2;

  ${media.giant`
    font-size: 3em;
    line-height: 1.025;
  `} ${media.desktop`
    font-size: 2.5em;
    line-height: 1.1;
  `};
`;

export default H1;
