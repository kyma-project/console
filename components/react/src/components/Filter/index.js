import React from 'react';
import { FormFieldset, FormInput, Button } from 'fundamental-react';

import { Dropdown } from '../Dropdown';
import {
  FiltersDropdownWrapper,
  FormLabel,
  FormItem,
  Panel,
  PanelBody
} from './styled';

const Filter = ({ filter, onChange }) => {
  const disabled = !(filter && filter.values && filter.values.length > 0);
  const control = (
    <Button option="emphasized" disabled={disabled} data-e2e-id="toggle-filter">
      Filter
    </Button>
  );
  return !filter ? null : (
    <FiltersDropdownWrapper>
      {/* <Dropdown control={control}> */}
        <Panel>
          <PanelBody>
            <FormFieldset>
              {filter.map((item, index) => {
                console.log(item, index)
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
      {/* </Dropdown> */}
    </FiltersDropdownWrapper>
  );
};

export default Filter;
