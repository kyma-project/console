import React from 'react';
import PropTypes from 'prop-types';

import { FilterHeader, Items, Item, Link } from './styled';

const Filter = ({ name, items = [], activeValue, onChange }) => {
  const onFilterClick = value => {
    return onChange(name, value);
  };

  return (
    <div>
      <FilterHeader data-e2e-id={`filter-header-${name}`}>
        Filter by {name}
      </FilterHeader>

      <Items data-e2e-id={`filter-items-by-${name}`}>
        {items.map(item => {
          const count = typeof item.count === 'number' ? `(${item.count})` : '';
          const active = activeValue === item.value;

          return (
            <Item key={item.name} data-e2e-id="filter-item">
              <Link active={active} onClick={() => onFilterClick(item.value)}>
                {item.name} {count}
              </Link>
            </Item>
          );
        })}
      </Items>
    </div>
  );
};

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  activeValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Filter;
