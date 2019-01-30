import styled from 'styled-components';
import { PanelGrid, Panel, PanelHeader, PanelBody } from '@kyma-project/react-components';

export const ServiceInstanceInfoWrapper = styled(PanelGrid)`
  display: flex;
  padding-bottom: 20px; 
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  font-weight: normal;
  border-left: ${props => (props.color ? '6px solid ' + props.color : 'none')};
`;

export const StretchedContentWrapper = styled(ContentWrapper)`
  align-self: stretch;
`;

export const CenterSideWrapper = styled(Panel)`
  && {
    border-left: ${props => (props.color ? '6px solid ' + props.color : 'none')};
  }
`;

export const ContentHeader = styled(PanelHeader)`
  && {
    color: rgb(50, 54, 58);
    font-size: 16px;
    font-weight: normal;
  }
`;

export const ContentDescription = styled(PanelBody)`
`;

export const Element = styled.div`
  margin: ${props => (props.margin ? props.margin : '16px 0 0 0')};
`;

export const InfoIcon = styled.div`
  width: 13px;
  height: 14px;
  line-height: 19px;
  font-family: SAP-icons;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  float: right;
  color: ${props => props.color};
`;

export const ServiceClassButton = styled.span`
  color: #0a6ed1;
  cursor: pointer;
`;

export const PlanModalButton = styled.span`
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  font-weight: 500;
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: #0b74de;
  cursor: pointer;
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  margin: 10px 10px 0 0;
`;

export const ExternalLink = styled.a`
  && {
    font-size: 14px;
    color: #167ee6;
    font-weight: 500;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
`;

export const JSONCode = styled.code`
  width: 100%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;
