import React from 'react';
import { Panel, Button, Popover } from 'fundamental-react';

import Search from './Search/Search.container';
import FilterPopover from './FilterPopover/FilterPopover.container';
import ActiveFilters from './ActiveFilters.container';
import AddUrlModal from '../Modals/AddUrlModal/AddUrlModal.container';

import { Filters } from '../../types';
import { CORE } from '../../constants';

import { PanelWrapper, StyledToken } from './styled';

interface TableComponentProps {
  configurationsExist: boolean;
}

const TableComponent: React.FunctionComponent<TableComponentProps> = ({
  configurationsExist,
  children,
}) => {
  return (
    <PanelWrapper>
      <Panel>
        <Panel.Header>
          <Panel.Head title={CORE.PANEL_TITLE} />
          <Panel.Actions>
            <Search />
            <FilterPopover />
          </Panel.Actions>
        </Panel.Header>
        <ActiveFilters />
        <Panel.Body>{children}</Panel.Body>
      </Panel>
    </PanelWrapper>
  );
};

export default TableComponent;
