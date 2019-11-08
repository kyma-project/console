import styled from 'styled-components';
import { media, PanelGrid } from '@kyma-project/react-components';

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
  padding: 30px 30px 0 30px;
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

export const ServiceGridWrapper = styled(PanelGrid)`
  display: flex;
  && {
    margin-bottom: 20px;
    grid-gap: 20px;
    ${media.phone`
      grid-template-columns: repeat(1,1fr);
    `};
  }
`;

export const LeftSideWrapper = styled.div`
  box-sizing: border-box;
  width: 300px;
  padding: 30px 30px 0 30px;
  text-align: left;
  flex: 0 0 auto;

  ${media.phone`
    width: 100%;
    flex: 1 1 100%;
  `};
`;

export const EmptyList = styled.div`
  width: 100%;
  font-family: '72';
  text-align: center;
  font-size: 20px;
  color: #32363a;
  padding: 30px;
`;
export const Bold = styled.span`
  font-weight: 700;
  padding: 0 3px;
`;
