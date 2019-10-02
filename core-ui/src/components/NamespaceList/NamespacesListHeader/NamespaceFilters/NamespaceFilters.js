import React from 'react';
import PropTypes from 'prop-types';

import { Menu, Button } from '@kyma-project/react-components';
import { Popover, FormInput, Counter } from 'fundamental-react';

NamespaceFilters.funcpropTypes = {
  filters: PropTypes.arrayOf(PropTypes.object.isRequired),
  updateFilters: PropTypes.func.isRequired,
};

export default function NamespaceFilters({ filters, updateFilters }) {
  const onFilterClick = e => {
    const newFilters = filters.map(f =>
      e.name === f.name
        ? {
            ...e,
            isSelected: !e.isSelected,
          }
        : f,
    );
    updateFilters(newFilters);
  };

  const popoverBody = (
    <Menu.List>
      {Array.from(filters).map(e => (
        <Menu.Item key={e.name} onClick={() => onFilterClick(e)}>
          <FormInput
            type="checkbox"
            className="fd-has-margin-right-small"
            checked={e.isSelected}
          />
          {e.name}
        </Menu.Item>
      ))}
    </Menu.List>
  );

  const activeFilters = filters.filter(l => l.isSelected);

  const popoverControl = (
    <Button glyph="filter" option="light">
      {!!activeFilters.length && (
        <Counter className="fd-has-background-color-status-4" notification>
          {activeFilters.length}
        </Counter>
      )}
    </Button>
  );

  return (
    <Popover
      body={popoverBody}
      control={popoverControl}
      placement="bottom-end"
      noArrow
    />
  );
}
