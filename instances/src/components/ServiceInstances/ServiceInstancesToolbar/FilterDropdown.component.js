import React from 'react';

import {
  Button,
  Dropdown,
  FormFieldset,
  FormInput,
} from '@kyma-project/react-components';

import {
  FiltersDropdownWrapper,
  FormLabel,
  FormItem,
  Panel,
  PanelBody,
} from './styled';

const FilterDropdown = ({ filter, onChange }) => {
  const disabled = !(filter && filter.values && filter.values.length > 0);
  const control = (
    <Button option="emphasized" disabled={disabled} data-e2e-id="toggle-filter">
      Filter
    </Button>
  );

  return !filter ? null : (
    <FiltersDropdownWrapper>
      <Dropdown control={control} disabled={disabled}>
        <Panel>
          <PanelBody>
            <FormFieldset>
              {filter.values.map((item, index) => {
                const count = item.count !== null ? ` (${item.count})` : '';

                return (
                  <FormItem isCheck key={index}>
                    <FormInput
                      data-e2e-id={`filter-${item.name}`}
                      type="checkbox"
                      id={`checkbox-${index}`}
                      name={`checkbox-name-${index}`}
                      onClick={() => onChange(filter.name, item.value)}
                    />
                    <FormLabel htmlFor={`checkbox-${index}`}>
                      {item.name}
                      {count}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </FormFieldset>
          </PanelBody>
        </Panel>
      </Dropdown>
    </FiltersDropdownWrapper>
  );
};

export default FilterDropdown;
