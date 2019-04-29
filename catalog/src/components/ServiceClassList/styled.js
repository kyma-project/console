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

export const StatusWrapper = styled.div`
  background-color: #6d7678;
  position: relative;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  border: none;
  overflow: hidden;
  float: left;

  &:first-child {
    margin-left: 0;
  }
`;

export const Status = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  border: none;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  font-family: '72';
  line-height: 20px;
  font-size: 12px;
  color: #ffffff;
`;
