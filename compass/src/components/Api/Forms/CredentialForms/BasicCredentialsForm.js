import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import TextFormItem from './../../../Shared/TextFormItem';

export const CREDENTIAL_TYPE_BASIC = 'Basic';

export const basicRefPropTypes = PropTypes.shape({
  username: CustomPropTypes.ref,
  password: CustomPropTypes.ref,
});

BasicCredentialsForm.propTypes = {
  refs: basicRefPropTypes,
  defaultValues: PropTypes.object,
};

export default function BasicCredentialsForm({ refs, defaultValues }) {
  return (
    <section className="fd-has-margin-top-medium">
      <TextFormItem
        inputKey="username"
        required
        type="text"
        label="Username"
        inputRef={refs.username}
        defaultValue={defaultValues && defaultValues.username}
      />
      <TextFormItem
        inputKey="password"
        required
        type="password"
        label="Password"
        inputRef={refs.password}
        defaultValue={defaultValues && defaultValues.password}
      />
    </section>
  );
}
