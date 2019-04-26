import React, { useContext } from 'react';

import ActiveFiltersComponent from './ActiveFilters.component';
import { FiltersService } from '../../services';

const ActiveFiltersContainer: React.FunctionComponent = () => {
  const {
    activeFilters,
    removeFilterLabel,
    removeAllFiltersLabels,
    hasActiveLabel,
  } = useContext(FiltersService);

  return (
    <ActiveFiltersComponent
      activeFilters={activeFilters}
      removeFilterLabel={removeFilterLabel}
      removeAllFiltersLabels={removeAllFiltersLabels}
      hasActiveLabel={hasActiveLabel}
    />
  );
};

export default ActiveFiltersContainer;
