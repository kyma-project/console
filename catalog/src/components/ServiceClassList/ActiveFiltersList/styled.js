import styled from 'styled-components';

export const ActiveFiltersListWrapper = styled.div`
  text-align: left;
  margin: 20px 0 10px 0;
  padding: 0 34px;
`;

export const ActiveFilter = styled.div`
  display: inline-block;
  color: #515559;
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  font-weight: normal;
  padding: 6px 10px;
  margin: 0 12px 12px 0;
  border-radius: 4px;
  background-color: #e0eaf3;
`;

export const CancelButton = styled.div`
  display: inline-block;
  position: relative;
  top: 1px;
  margin-left: 6px;
  font-size: 12px;
  cursor: pointer;
`;

export const ClearAllActiveFiltersButton = styled.button`
  color: #0a6ed1;
  padding: 0;
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  font-weight: normal;
  border: none;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: none;
    color: #0a6ed1;
  }
`;
