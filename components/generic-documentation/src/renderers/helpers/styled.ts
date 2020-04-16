import styled from 'styled-components';
import { ComboboxInput, Menu } from 'fundamental-react';

const typeColumnWidth = '6em';
const listItemColumnGap = '1em';
const listItemPadding = '2 * 10px';
export const ListItem = styled.span`
   {
    justify-items: start;
    display: grid;
    grid-gap: ${listItemColumnGap};
    grid-template-columns: ${typeColumnWidth} auto;
  }
`;

export const ApiTabHeader = styled.div`
   {
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    grid-gap: 1em;
  }
`;

export const Combobox = styled(ComboboxInput)`
   {
    flex-shrink: 0;
    min-width: calc(
      ${props => props['data-max-list-chars'] + 'ch'} + ${typeColumnWidth} +
        ${listItemColumnGap} + ${listItemPadding}
    );
  }
`;

export const List = styled(Menu)`
   {
    max-height: 28em;
    overflow-y: auto;
  }
`;
