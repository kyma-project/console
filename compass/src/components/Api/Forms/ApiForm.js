import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes, TextFormItem } from 'react-shared';

ApiForm.propTypes = {
  formValues: PropTypes.shape({
    name: CustomPropTypes.ref,
    description: CustomPropTypes.ref,
    group: CustomPropTypes.ref,
    targetURL: CustomPropTypes.ref,
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
        defaultValue={defaultValues && defaultValues.name}
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
        inputRef={formValues.targetURL}
        defaultValue={defaultValues && defaultValues.targetURL}
      />
    </>
  );
}
