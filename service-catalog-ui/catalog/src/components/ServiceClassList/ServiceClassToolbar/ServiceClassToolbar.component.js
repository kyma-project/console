import React from 'react';

import { serviceClassConstants } from '../../../variables';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from './SearchDropdown.component';
import FilterDropdown from './FilterDropdown.component';

const ServiceClassToolbar = ({
  searchFn,
  availableLabels,
  onLabelChange,
  serviceClassesExists,
  activeLabelFilters,
}) => {
  return (
    <Toolbar background="#fff" title={serviceClassConstants.title}>
      {serviceClassesExists ? (
        <>
          <SearchDropdown onChange={e => searchFn(e.target.value)} />
          <FilterDropdown
            onLabelChange={onLabelChange}
            availableLabels={availableLabels}
            activeLabelFilters={activeLabelFilters}
          />
        </>
      ) : null}
    </Toolbar>
  );
};

export default ServiceClassToolbar;
