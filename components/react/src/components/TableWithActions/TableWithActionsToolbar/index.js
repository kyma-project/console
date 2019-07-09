import React from 'react';
import {
  ActionBar,
  ActionBarActions,
  ActionBarBack,
  ActionBarHeader,
} from '../../Toolbar/styled';

const TableWithActionsToolbar = ({
  goBack,
  title,
  description,
  children,
}) => (
  <ActionBar data-e2e-id="toolbar">
    {typeof goBack === 'function' && (
      <ActionBarBack onClick={goBack} data-e2e-id="toolbar-back" />
    )}
    <ActionBarHeader
      title={title}
      description={description}
      data-e2e-id="toolbar-header"
    />
    <ActionBarActions data-e2e-id="toolbar-actions">
      {children}
    </ActionBarActions>
  </ActionBar>
);

export default TableWithActionsToolbar