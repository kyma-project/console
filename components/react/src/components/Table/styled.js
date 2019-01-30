import styled from 'styled-components';
import { Panel, PanelHeader, PanelHead, PanelActions, PanelBody, Table } from 'fundamental-react';

export const TableWrapper = styled(Panel)`
`;

export const TableHeader = styled(PanelHeader)`
  && {
    padding: 16px;
  }
`;

export const TableHeaderHead = styled(PanelHead)`
`;

export const TableHeaderActions = styled(PanelActions)`
`;

export const TableBody = styled(PanelBody)`
  && {
    padding: 0;
  }
`;

export const TableContent = styled(Table)`
  && {
    margin-bottom: 0;
    border: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;

    > thead {
      border-bottom: solid 1px #eeeeef;

      > tr {
        cursor: auto;
      }
    }

    > tbody tr {
      border: none;
      cursor: auto;
    }
  }
`;

export const NotFoundMessage = styled.p`
  width: 100%;
  font-size: 18px;
  padding: 20px 0;
  margin: 0 auto;
  text-align: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;
