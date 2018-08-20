import styled from 'styled-components';

export const TableContentWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  font-family: '72';
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  min-height: 40px;
  text-align: center;
  font-size: 14px;
  line-height: 40px;

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const NotFoundMessage = styled.p`
  line-height: 40px;
  font-size: 16px;
  padding: 16px 0;
  margin: 0;
`;
