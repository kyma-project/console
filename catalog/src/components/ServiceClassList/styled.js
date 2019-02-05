import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

export const SearchWrapper = styled.div`
  max-width: 390px;
  flex: 1 0 auto;
`;

export const ServiceClassListWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  align-items: flex-start;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  ${props => (props.phoneRows ? media.phone`flex-flow: column nowrap;` : '')};
`;

export const CardsWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  padding: 0 20px 30px 20px;
`;

export const EmptyServiceListMessageWrapper = styled.p`
  text-align: center;
  font-size: 18px;
  padding: 20px 0;
  margin: 0 auto;
`;
