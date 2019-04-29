import React, { useContext } from 'react';

import FilterPopoverComponent from './FilterPopover.component';
import FilterPopoverBody from './FilterPopoverBody.component';

import {
  ConfigurationsService,
  FiltersService,
  LabelsService,
} from '../../../services';

const FilterPopoverContainer: React.FunctionComponent = () => {
  const { configurationsExist } = useContext(ConfigurationsService);
  const { activeFilters, setFilterLabel, hasActiveLabel } = useContext(
    FiltersService,
  );
  const { uniqueLabels } = useContext(LabelsService);

  const filterPopoverBody = (
    <FilterPopoverBody
      activeFilters={activeFilters}
      uniqueLabels={uniqueLabels}
      setFilterLabel={setFilterLabel}
      hasActiveLabel={hasActiveLabel}
    />
  );

  let activeFiltersLength: number = 0;
  Object.keys(activeFilters.labels).map(key => {
    activeFiltersLength += activeFilters.labels[key].length;
  });

  return (
    <FilterPopoverComponent
      activeFiltersLength={activeFiltersLength}
      body={filterPopoverBody}
      configurationsExist={configurationsExist()}
    />
  );
};

export default FilterPopoverContainer;
