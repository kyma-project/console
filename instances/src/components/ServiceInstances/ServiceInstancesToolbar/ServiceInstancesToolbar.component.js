import React from 'react';

import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from './SearchDropdown.component';
import FilterDropdown from './FilterDropdown.component';

const ServiceInstancesToolbar = ({
  filterClassesAndSetActiveFilters,
  labelFilter,
  allActiveFilters,
  serviceInstancesExists,
}) => {
  return (
    <Toolbar
      headline="Service Instances"
      description="You can configure the instances and manage bindings of each of your instantiated services here"
    >
      {serviceInstancesExists ? (
        <div>
          <SearchDropdown
            onChange={e =>
              filterClassesAndSetActiveFilters('search', e.target.value)
            }
          />
          <FilterDropdown
            onChange={filterClassesAndSetActiveFilters}
            filter={labelFilter}
            activeValues={allActiveFilters.labels}
          />
        </div>
      ) : null}
    </Toolbar>
  );
};

export default ServiceInstancesToolbar;
