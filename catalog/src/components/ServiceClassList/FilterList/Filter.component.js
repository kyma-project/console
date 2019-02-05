import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@kyma-project/react-components';

import { Checkmark, FilterHeader, FilterContainer, Items, Item } from './styled';

const Filter = ({
  name,
  items = [],
  activeValue,
  onChange,
  activeTagsFilters,
  onSeeMore,
  isMore,
}) => {
  const onFilterClick = value => {
    return onChange(name, value);
  };

  const onSeeMoreClick = value => {
    let more = { ...activeTagsFilters[name] };
    more.isMore = false;
    more.offset = 0;
    return onSeeMore(name, more);
  };

  const filterCategoryHeader = {
    basic: 'Basic filter',
    tag: 'Filter by tag',
    provider: 'Filter by provider',
    connectedApplication: 'Connected applications',
  };

  return (
    <FilterContainer>
      {items &&
        items.length > 0 && (
          <FilterHeader data-e2e-id={`filter-header-${name}`}>
            {filterCategoryHeader[name]}
          </FilterHeader>
        )}
      <Items data-e2e-id={`filter-items-by-${name}`}>
        {items.map(item => {
          const active =
            !item.value && !activeValue.length
              ? true
              : activeValue.includes(item.value);
          return (
            <Item
              key={item.name}
              data-e2e-id={`filter-item-${name}-${item.name}`}
              onClick={() => onFilterClick(item.value)}
            >
              <Checkmark checked={active} />
              <Text
                color="#32363b"
                fontSize="14px"
                lineHeight="1.29"
                data-e2e-id="filter-item"
              >
                {item.name}
              </Text>
            </Item>
          );
        })}
        {isMore && (
          <Item>
            <Button
              option="light"
              onClick={() => onSeeMoreClick(name)}
            >
              see more
            </Button>
          </Item>
        )}
      </Items>
    </FilterContainer>
  );
};

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  activeValue: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default Filter;
