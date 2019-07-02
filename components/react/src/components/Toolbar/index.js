import React from 'react';
import {
  ActionBar,
  ActionBarActions,
  ActionBarBack,
  ActionBarHeader,
} from './styled';

export default ({
  goBack,
  title,
  description,
  background,
  children,
  nowrap,
}) => (
  <ActionBar data-e2e-id="toolbar" background={background}>
    {typeof goBack === 'function' && (
      <ActionBarBack onClick={goBack} data-e2e-id="toolbar-back" />
    )}
    <ActionBarHeader
      title={title}
      description={description}
      nowrap={nowrap}
      data-e2e-id="toolbar-header"
    />
    <ActionBarActions data-e2e-id="toolbar-actions">
      {children}
    </ActionBarActions>
  </ActionBar>
);
