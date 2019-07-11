import styled from 'styled-components';
import { sizes } from '@kyma-project/react-components';

export const Header = styled.header`
  background-color: #fff;
`;

export const ActionBarWrapper = styled.header`
   {
    @media (min-width: ${sizes.phone}px) {
      display: flex;
      justify-content: space-between;
    }
  }
`;

export const TitlebarWrapper = styled.section`
  width: 100%;
`;
