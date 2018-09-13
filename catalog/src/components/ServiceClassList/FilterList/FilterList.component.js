import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, Search, Separator } from '@kyma-project/react-components';

import Filter from './Filter.component';

import { FilterContainer, SearchWrapper } from './styled';

const FilterList = ({
  filters,
  active,
  onChange,
  onSearch,
  onSeeMore,
  activeTagsFilters,
  activeFiltersCount,
}) => (
  <Dropdown
    name={activeFiltersCount ? `Filter (${activeFiltersCount})` : 'Filter'}
    enabled={filters && filters.length > 0}
    marginTop="0"
    lastButton
    primary
    arrowTop
  >
    <SearchWrapper>
      <Search placeholder="Search" onChange={onSearch} id="search-filter" />
    </SearchWrapper>
    <FilterContainer data-e2e-id="filter">
      {filters &&
        filters.map((filter, idx) => (
          <Fragment key={filter.name}>
            {filter.values &&
              filter.values.length > 0 && (
                <Fragment>
                  <Filter
                    name={filter.name}
                    items={filter.values}
                    activeValue={active[filter.name]}
                    onChange={onChange}
                    activeTagsFilters={activeTagsFilters}
                    onSeeMore={onSeeMore}
                    isMore={filter.isMore}
                  />
                  {idx < filters.length - 1 && (
                    <Separator margin="15px -16px 15px" />
                  )}
                </Fragment>
              )}
          </Fragment>
        ))}
    </FilterContainer>
  </Dropdown>
);

FilterList.propTypes = {
  filters: PropTypes.array,
  active: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterList;
