import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

export const SearchWrapper = styled.div`
  max-width: 640px;
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

export const EmptyServiceListMessageWrapper = styled.div`
  text-align: center;
  font-size: 18px;
  padding: 20px 0;
  margin: 0 auto;
`;

export const ServiceClassDescription = styled.div`
  color: #74777a;
  font-size: 16px;
  text-align: left;
  padding: 30px 30px 0;
`;

export const StatusesList = styled.ul`
  margin: 0 0 0 10px;
  align-items: center;
  display: grid;
  grid-gap: 3px;
`;

export const StatusWrapper = styled.li`
  grid-row: 1;
  &:first-child {
    margin-left: 0;
  }
`;

export const EmptyList = styled.div`
  width: 100%;
  font-family: '72';
  text-align: center;
  font-size: 20px;
  color: #32363a;
  margin: 50px 0;
`;
