import React from 'react';

import { serviceInstanceConstants } from '../../../variables';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from './SearchDropdown.component';
import FilterDropdown from './FilterDropdown.component';

const ServiceInstancesToolbar = ({
  searchFn,
  availableLabels,
  onLabelChange,
  serviceInstancesExists,
  activeLabelFilters,
}) => {
  return (
    <Toolbar background="#fff" title={serviceInstanceConstants.title}>
      {serviceInstancesExists ? (
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

export default ServiceInstancesToolbar;
