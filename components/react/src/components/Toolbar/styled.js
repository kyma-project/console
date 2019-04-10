import styled from 'styled-components';
import { ActionBar as AB } from 'fundamental-react/lib/ActionBar';

const ABBack = AB.Back;
const ABHeader = AB.Header;
const ABActions = AB.Actions;
export const ActionBar = styled(AB)`
  && {
    padding: 30px 30px 0 30px;
  }
`;

export const ActionBarBack = styled(ABBack)`
  && {
    @media (min-width: 320px) {
      display: block !important;
    }
  }
`;

export const ActionBarHeader = styled(ABHeader)`
  && {
    padding: 0;
    text-align: left;
    width: auto;
  }
`;

export const ActionBarActions = styled(ABActions)`
  && {
    align-items: flex-end;
  }
`;
