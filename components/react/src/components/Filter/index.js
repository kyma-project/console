import React from 'react';
import { FormFieldset, FormInput, Button, Popover } from 'fundamental-react';

import {
  FiltersDropdownWrapper,
  FormLabel,
  FormItem,
  Panel,
  PanelBody,
} from './styled';

class Filter extends React.Component {
  render() {
    const filters = [];
    if (this.props.data && this.props.data.length) {
      this.props.data.forEach(app => {
        for (const key in app.labels) {
          if (app.labels.hasOwnProperty(key) && app.labels[key].length > 0) {
            app.labels[key].forEach(lab => {
              if (lab === 'undefined') {
                filters.push({
                  value: key,
                  checked: false,
                });
              } else {
                filters.push({
                  value: key + '=' + lab,
                  checked: false,
                });
              }
            });
          }
        }
      });
    }

    const control = (
      <Button
        option="emphasized"
        disabled={!this.props.allFilters}
        data-e2e-id="toggle-filter"
      >
        Filter
      </Button>
    );

    const body = ({ filters, onChange }) => {
      return (
        <Panel>
          <PanelBody>
            <FormFieldset>
              {filters.map((item, index) => {
                return (
                  <FormItem isCheck key={index}>
                    <FormInput
                      data-e2e-id={`filter-${item.value}`}
                      type="checkbox"
                      id={`checkbox-${index}`}
                      name={`checkbox-name-${index}`}
                      onClick={onChange()}
                      onChange={() => {
                        item.checked = !item.checked;
                      }}
                    />
                    <FormLabel htmlFor={`checkbox-${index}`}>
                      {item.value}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </FormFieldset>
          </PanelBody>
        </Panel>
      );
    };

    return !filters ? null : (
      <FiltersDropdownWrapper>
        <Popover
          disabled={!filters}
          control={control}
          body={body({ filters, onChange: this.props.onChange })}
        />
      </FiltersDropdownWrapper>
    );
  }
}

export default Filter;
