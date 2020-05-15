import React from 'react';

import {
  Button,
  Dropdown,
  FormFieldset,
  FormLabel,
  FormItem,
  Panel,
  FormInput,
} from 'fundamental-react';
import { FiltersDropdownWrapper, Popover } from './styled';
import './FilterDropdown.scss';

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

  const labels = Object.entries(availableLabels).map(([label, count]) => (
    <FormItem key={label} className="filter-dropdown__item">
      <FormInput
        data-e2e-id={`filter-${label}`}
        type="checkbox"
        id={label}
        onChange={handleLabelClick}
        checked={activeLabelFilters.includes(label)}
        className="fd-has-margin-right-tiny"
      />
      <FormLabel htmlFor={label} className="fd-has-color-text-3">
        {label} ({count})
      </FormLabel>
    </FormItem>
  ));

  return (
    <FiltersDropdownWrapper>
      <Dropdown>
        <Popover
          body={
            <Panel>
              <Panel.Body>
                <FormFieldset>{labels}</FormFieldset>
              </Panel.Body>
            </Panel>
          }
          control={control}
          placement="bottom-end"
        />
      </Dropdown>
    </FiltersDropdownWrapper>
  );
  // return (
  //   <FiltersDropdownWrapper>
  //     <Dropdown control={control} disabled={disabled}>
  //
  //     </Dropdown>
  //   </FiltersDropdownWrapper>
  // );
};

export default FilterDropdown;
