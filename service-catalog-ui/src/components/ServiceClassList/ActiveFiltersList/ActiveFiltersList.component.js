import React from 'react';
import PropTypes from 'prop-types';

import { Token } from '@kyma-project/react-components';

import {
  ActiveFiltersListWrapper,
  ActiveFilterWrapper,
  ClearAllActiveFiltersButton,
} from './styled';

const ActiveFiltersList = ({
  activeFilters,
  clearAllActiveFilters,
  onCancel,
}) => {
  const filterCategories = ['basic', 'tag', 'provider', 'connectedApplication'];

  return (
    <ActiveFiltersListWrapper data-e2e-id="active-filters-wrapper">
      {filterCategories.map(category =>
        activeFilters[category].map((filter, id) => (
          <ActiveFilterWrapper key={`${filter}-${id}`}>
            <Token
              data-e2e-id="active-filter"
              clickHandler={() => onCancel(category, filter)}
            >
              {filter}
            </Token>
          </ActiveFilterWrapper>
        )),
      )}
      <ClearAllActiveFiltersButton onClick={clearAllActiveFilters}>
        Clear all filters
      </ClearAllActiveFiltersButton>
    </ActiveFiltersListWrapper>
  );
};

ActiveFiltersList.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  clearAllActiveFilters: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ActiveFiltersList;
