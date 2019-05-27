import styled from 'styled-components';
import Grid from 'styled-components-grid';
export const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  margin: ${props => (props.customMargin ? props.customMargin : '30px 0 0')};
  text-align: left;
  flex: 0 1 auto;
  display: flex;
  min-height: calc(100% - 30px);
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  font-weight: normal;
  border-left: 6px solid #ee0000;
  align-self: stretch;
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
  padding: 15px 20px;
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
  padding: 16px 0 10px;
`;

export const InfoIcon = styled.button`
  background: transparent;
  border: none;
  line-height: 19px;
  font-family: SAP-icons;
  font-size: 13px;
  float: right;
  color: red;
  cursor: pointer;
`;

export const GridWrapper = styled(Grid)`
  display: flex;
`;

export const MessageWrapper = styled.div`
  margin: 0 34px;
`;
