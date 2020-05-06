import styled from 'styled-components';

export const ActiveFiltersListWrapper = styled.div`
  text-align: left;
  margin: 20px 0 0 0;
`;

export const ActiveFilterWrapper = styled.div`
  display: inline-block;
  margin: 0 12px 12px 0;
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
