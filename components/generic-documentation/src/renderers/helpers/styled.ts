import styled from 'styled-components';
import { ComboboxInput, Menu } from 'fundamental-react';

export const Logo = styled.img`
   {
    height: 1.7em;
  }
`;

export const ListItem = styled.span`
   {
    justify-items: start;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 6em auto;
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
    min-width: 20em;
  }
`;

export const List = styled(Menu)`
   {
    max-height: 28em;
    overflow-y: auto;
  }
`;
