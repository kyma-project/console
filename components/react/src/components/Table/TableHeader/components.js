import styled from 'styled-components';

export const TableHeaderWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  font-family: '72';
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const TableHeaderTitle = styled.div`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: #32363a;
  padding: 14px 20px;
`;

export const TableHeaderAdditionalContent = styled.div`
  float: right;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  padding: 14px 20px;
`;

export const TableHeaderLink = styled.button`
  display: block;
  background: none;
  border: 0;
  font-size: 14px;
  color: #0a6ed1;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: right;
  float: right;
  color: #0a6ed1;
  padding: 14px 15px;
  cursor: pointer;
  text-decoration: none;
`;

export const TableHeaderColumnsWrapper = styled.div`
  background-color: rgba(243, 244, 245, 0.45);
  border-top: 1px solid #efeff0;
`;

export const TableHeaderColumnName = styled.div`
  padding: 13px 20px;
  height: 13px;
  opacity: 0.6;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: #32363a;
  text-transform: uppercase;
`;
