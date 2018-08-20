import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Separator } from '@kyma-project/react-components';

import Filter from './Filter.component';

import { FilterContainer } from './styled';

const FilterList = ({ filters, active, onChange }) => (
  <FilterContainer data-e2e-id="filter">
    {filters.map((filter, idx) => (
      <Fragment key={filter.name}>
        <Filter
          name={filter.name}
          items={filter.values}
          activeValue={active[filter.name]}
          onChange={onChange}
        />
        {idx < filters.length - 1 && <Separator margin="25px 0 15px" />}
      </Fragment>
    ))}
  </FilterContainer>
);

FilterList.propTypes = {
  filters: PropTypes.array.isRequired,
  active: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterList;
