import React from 'react';

import { Button, Dropdown, FormFieldset } from '@kyma-project/react-components';

import {
  FiltersDropdownWrapper,
  FormLabel,
  FormItem,
  Panel,
  PanelBody,
  FormInput,
} from './styled';

const FilterDropdown = ({
  onLabelChange,
  availableLabels,
  activeLabelFilters,
}) => {
  const disabled = Object.entries(availableLabels).length === 0;
  const control = (
    <Button option="emphasized" disabled={disabled} data-e2e-id="toggle-filter">
      Filter
    </Button>
  );

  const handleLabelClick = ev => {
    onLabelChange(ev.target.id, ev.target.checked);
  };

  return (
    <FiltersDropdownWrapper>
      <Dropdown control={control} disabled={disabled}>
        <Panel>
          <PanelBody>
            <FormFieldset>
              {Object.entries(availableLabels).map(
                ({ 0: label, 1: count }, index) => {
                  return (
                    <FormItem isCheck key={index}>
                      <FormInput
                        data-e2e-id={`filter-${label}`}
                        type="checkbox"
                        id={label}
                        name={`checkbox-name-${index}`}
                        onClick={handleLabelClick}
                        checked={activeLabelFilters.includes(label)}
                      />
                      <FormLabel htmlFor={`checkbox-${index}`}>
                        {label} ({count})
                      </FormLabel>
                    </FormItem>
                  );
                },
              )}
            </FormFieldset>
          </PanelBody>
        </Panel>
      </Dropdown>
    </FiltersDropdownWrapper>
  );
};

export default FilterDropdown;
