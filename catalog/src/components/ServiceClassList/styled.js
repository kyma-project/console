import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

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
  padding: 0 20px;
`;

export const EmptyServiceListMessageWrapper = styled.div`
  padding: 20px 0;
`;
