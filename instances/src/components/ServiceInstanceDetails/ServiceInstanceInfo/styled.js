import styled from 'styled-components';
import { PanelGrid, Panel, PanelHeader } from '@kyma-project/react-components';

export const ServiceInstanceInfoWrapper = styled(PanelGrid)`
  margin: 0 32px;
  && > * {
    box-shadow: none;
  }
`;

export const StatusWrapper = styled(Panel)`
   {
    && {
      border: solid 1px #d9d9d9;
      border-left: ${props =>
        props.color ? '6px solid ' + props.color : 'none'};
    }
  }
`;

export const ContentHeader = styled(PanelHeader)`
  && {
    color: #32363a;
    font-size: 16px;
    font-weight: normal;
  }
`;

export const Element = styled.div`
  margin: ${props => (props.margin ? props.margin : '16px 0 0 0')};
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

export const DescriptionKey = styled.p`
  margin-bottom: 0;
  margin-top: 24px;
  color: #6a6d70;
  font-size: 14px;
`;

export const ServiceInstanceDescription = styled.div`
  color: #74777a;
  font-size: 16px;
  text-align: left;
  line-height: 1.25;
`;
