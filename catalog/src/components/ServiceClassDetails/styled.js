import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

export const ServiceClassDetailsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  align-items: flex-start;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  ${props => (props.phoneRows ? media.phone`flex-flow: column nowrap;` : '')};
`;

export const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 30px 30px 0 0;
  text-align: left;
  flex: 1 1 auto;

  ${media.phone`
    padding: 30px;
    width:100%;
  `} ${media.tablet`
    width:100%;
    padding-right: 30px;
  `};
`;

export const LeftSideWrapper = styled.div`
  box-sizing: border-box;
  width: 300px;
  padding: 30px;
  text-align: left;
  flex: 0 0 auto;

  ${media.phone`
    width: 100%;
    flex: 1 1 100%;
  `};
`;
