import React, { useContext } from 'react';

import ActiveFiltersComponent from './ActiveFilters.component';
import FiltersService from '../../services/Filters.service';

interface ActiveFiltersProps {}

export const ActiveFiltersContainer: React.FunctionComponent<
  ActiveFiltersProps
> = () => {
  const {
    activeFilters,
    removeFilterLabel,
    removeAllFiltersLabels,
    hasActiveLabel,
  } = useContext(FiltersService.Context);

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
