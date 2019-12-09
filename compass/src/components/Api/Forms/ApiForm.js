import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import { FormItem, FormLabel, FormSelect } from 'fundamental-react';
import TextFormItem from './../../Shared/TextFormItem';

ApiForm.propTypes = {
  formValues: PropTypes.shape({
    name: CustomPropTypes.ref,
    description: CustomPropTypes.ref,
    group: CustomPropTypes.ref,
    targetUrl: CustomPropTypes.ref,
    type: CustomPropTypes.ref,
  }),
  defaultValues: PropTypes.object,
};

export default function ApiForm({ formValues, defaultValues }) {
  return (
    <>
      <TextFormItem
        label="Name"
        inputKey="api-name"
        required
        inputRef={formValues.name}
        // defaultValue={defaultValues && defaultValues.name}
        defaultValue={'domek'}
      />
      <TextFormItem
        label="Description"
        inputKey="api-description"
        inputRef={formValues.description}
        defaultValue={defaultValues && defaultValues.description}
      />
      <TextFormItem
        label="Group"
        inputKey="api-group"
        inputRef={formValues.group}
        defaultValue={defaultValues && defaultValues.group}
      />
      <TextFormItem
        label="Target URL"
        inputKey="api-target-url"
        required
        type="url"
        inputRef={formValues.targetUrl}
        // defaultValue={defaultValues && defaultValues.targetUrl}
        defaultValue={'http://1'}
      />
      <FormItem>
        <FormLabel htmlFor="api-type">Type</FormLabel>
        <FormSelect id="api-type" ref={formValues.type} defaultValue="OPEN_API">
          <option value="OPEN_API">
            {/* TODO selected? */}
            Open API
          </option>
          <option value="ODATA">OData</option>
        </FormSelect>
      </FormItem>
    </>
  );
}
