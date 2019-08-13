import React from 'react';

import { serviceInstanceConstants } from '../../../variables';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from './SearchDropdown.component';
import FilterDropdown from './FilterDropdown.component';

const ServiceInstancesToolbar = ({
  filterClassesAndSetActiveFilters,
  labelFilter,
  serviceInstancesExists,
}) => {
  return (
    <Toolbar background="#fff" title={serviceInstanceConstants.title}>
      {serviceInstancesExists ? (
        <>
          <SearchDropdown
            onChange={e =>
              filterClassesAndSetActiveFilters('search', e.target.value)
            }
          />
          <FilterDropdown
            onChange={filterClassesAndSetActiveFilters}
            filter={labelFilter}
          />
        </>
      ) : null}
    </Toolbar>
  );
};

export default ServiceInstancesToolbar;
