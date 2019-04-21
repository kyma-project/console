import React from 'react';
import {
  FormFieldset,
  FormLegend,
  FormItem,
  FormInput,
  FormLabel,
  Button,
} from 'fundamental-react';

import { FiltersLabelsInterface, Filters } from '../../../types';
import { FILTERS } from '../../../constants';

import { FormFieldsetWrapper, StyledGroup } from './styled';

interface Props {
  activeFilters: Filters;
}

const FilterPopoverBody: React.FunctionComponent<
  Props & FiltersLabelsInterface
> = ({ activeFilters, uniqueLabels, setFilterLabel, hasActiveLabel }) => {
  return (
    <FormFieldsetWrapper>
      <FormFieldset>
        <StyledGroup>
          <FormLegend>
            {FILTERS.LABELS_LEGEND}
          </FormLegend>
          {Object.keys(uniqueLabels).map(key => {
            return uniqueLabels[key].map((value, idx) => (
              <FormItem isCheck key={idx}>
                <FormInput
                  id={`checkbox-${idx}`}
                  name={`checkbox-name-${idx}`}
                  type="checkbox"
                  value={value}
                  checked={hasActiveLabel(key, value) || false}
                  onClick={() => setFilterLabel(key, value)}
                  onChange={() => null}
                />
                <FormLabel htmlFor={`checkbox-${idx}`}>
                  {`${key}=${value}`}
                </FormLabel>
              </FormItem>
            ));
          })}
        </StyledGroup>
      </FormFieldset>
    </FormFieldsetWrapper>
  );
};

export default FilterPopoverBody;
