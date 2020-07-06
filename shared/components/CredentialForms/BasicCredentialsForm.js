import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from '../../typechecking/CustomPropTypes';
import { TextFormItem } from '../TextFormItem/TextFormItem';

export const CREDENTIAL_TYPE_BASIC = 'Basic';

export const basicRefPropTypes = PropTypes.shape({
  username: CustomPropTypes.ref,
  password: CustomPropTypes.ref,
});

BasicCredentialsForm.propTypes = {
  refs: basicRefPropTypes,
  defaultValues: PropTypes.object,
};

export function BasicCredentialsForm({ refs, defaultValues }) {
  return (
    <>
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
    </>
  );
}
