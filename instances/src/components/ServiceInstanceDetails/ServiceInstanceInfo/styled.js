import styled from 'styled-components';
import Grid from 'styled-components-grid';

export const ServiceInstanceInfoWrapper = styled(Grid)`
  display: flex;
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

export const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  margin: ${props => ('left' === props.margin ? '30px 20px 0 0' : '30px 0 0')};
  text-align: left;
  flex: 0 1 auto;
  display: flex;
  min-height: calc(100% - 30px);
`;

export const ContentHeader = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  line-height: 1.19;
  font-size: 16px;
  padding: 16px 20px;
`;

export const ContentDescription = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 8px 22px 22px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #32363b;
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

export const PlanModalButton = styled.button`
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  font-weight: 300;
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: #0b74de;
  cursor: pointer;
`;

export const Label = styled.span`
  width: auto;
  display: inline-block;
  mix-blend-mode: multiply;
  border-radius: 4px;
  background-color: #eef5fc;
  font-size: 12px;
  font-family: 72;
  font-weight: 300;
  text-transform: uppercase;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #64696d;
  padding: 5px 8px;
  margin: 10px 10px 0 0;
`;

export const ExternalLink = styled.a`
  font-family: '72';
  font-size: 14px;
  color: #167ee6;
  font-weight: 300;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

export const JSONCode = styled.code`
  width: 100%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;
