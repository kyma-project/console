import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

import TextFormItem from './../../Shared/TextFormItem';

EventApiForm.propTypes = {
  formValues: PropTypes.shape({
    name: CustomPropTypes.ref,
    description: CustomPropTypes.ref,
    group: CustomPropTypes.ref,
  }),
  defaultValues: PropTypes.object,
};

export default function EventApiForm({ formValues, defaultValues }) {
  return (
    <>
      <TextFormItem
        label="Name"
        inputKey="event-api-name"
        required
        inputRef={formValues.name}
        defaultValue={defaultValues && defaultValues.name}
      />
      <TextFormItem
        label="Description"
        inputKey="event-api-description"
        inputRef={formValues.description}
        defaultValue={defaultValues && defaultValues.description}
      />
      <TextFormItem
        label="Group"
        inputKey="event-api-group"
        inputRef={formValues.group}
        defaultValue={defaultValues && defaultValues.group}
      />
    </>
  );
}
