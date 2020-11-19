import React from 'react';

import { serviceInstanceConstants } from 'helpers/constants';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from 'shared/SearchDropdown.component';
import FilterDropdown from './FilterDropdown.component';

const ServiceInstanceToolbar = ({
  searchQuery,
  searchFn,
  availableLabels,
  onLabelChange,
  serviceInstancesExists,
  activeLabelFilters,
}) => {
  return (
    <Toolbar
      background="#fff"
      title={serviceInstanceConstants.title}
      aria-label="title"
    >
      {serviceInstancesExists ? (
        <>
          <SearchDropdown
            searchQuery={searchQuery}
            onChange={e => searchFn(e.target.value)}
          />
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

export default ServiceInstanceToolbar;
