import React from 'react';
import { FormFieldset, FormInput, Button, Popover } from 'fundamental-react';

import { Dropdown } from '../Dropdown';
import {
  FiltersDropdownWrapper,
  FormLabel,
  FormItem,
  Panel,
  PanelBody
} from './styled';


const Filter = ({ filter, onChange }) => {
  const disabled = false;
  // const disabled = !(filter && filter.values && filter.values.length > 0);
  
  const control = (
    <Button option="emphasized" disabled={disabled} data-e2e-id="toggle-filter">
      Filter
    </Button>
  );

  const body = ({filter, onChange}) => (
    <Panel>
      <PanelBody>
        <FormFieldset>
          {filter.map((item, index) => {
            return (
              <FormItem isCheck key={index}>
                <FormInput
                  data-e2e-id={`filter-${item.name}`}
                  type="checkbox"
                  id={`checkbox-${index}`}
                  name={`checkbox-name-${index}`}
                  onClick={() => onChange()}
                />
                <FormLabel htmlFor={`checkbox-${index}`}>
                  {item.name}
                </FormLabel>
              </FormItem>
            );
          })}
        </FormFieldset>
      </PanelBody>
    </Panel>
  )

  return !filter ? null : (
    <FiltersDropdownWrapper>
      <Popover
        disabled={disabled}
        control={control}
        body={body({filter, onChange})}
      />
    </FiltersDropdownWrapper>
  );
};

export default Filter;
