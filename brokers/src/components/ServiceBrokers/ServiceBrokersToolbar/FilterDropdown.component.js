import React from 'react';

import { Dropdown, Text } from '@kyma-project/react-components';

import { List, Item, Checkmark } from './styled';

const FilterDropdown = ({ filter, activeValues = [], onChange }) =>
  !filter ? null : (
    <Dropdown disabled={!(filter.values && filter.values.length > 0)}>
      <List>
        {filter.values.map(item => {
          const count = item.count !== null ? ` (${item.count})` : '';
          const active = activeValues.some(value => value === item.value);

          return (
            <Item
              key={item.name}
              onClick={() => onChange(filter.name, item.value)}
            >
              <Checkmark checked={active} />
              <Text>
                {item.name}
                {count}
              </Text>
            </Item>
          );
        })}
      </List>
    </Dropdown>
  );

export default FilterDropdown;
