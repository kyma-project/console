import styled from 'styled-components';
import { media } from '../../../commons';

const H2 = styled.h2`
  font-size: 1.625em;
  line-height: 1.15384615;

  ${media.giant`
    font-size: 2.25em;
    line-height: 1.25;
  `} ${media.desktop`
    font-size: 2em;
    line-height: 1.25;
  `};
`;

export default H2;
