import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from '../../typechecking/CustomPropTypes';
import { InlineHelp, FormLabel } from 'fundamental-react';

const pattern = '^[a-z0-9]([-a-z0-9]*[a-z0-9])?$';
const regex = new RegExp(pattern);

export const isK8SNameValid = name => {
  return regex.test(name);
};

export const K8sNameInput = ({
  _ref,
  id,
  kind,
  showHelp = true,
  label = 'Name',
  required = true,
  ...props
}) => (
  <>
    <FormLabel required={required} htmlFor={id}>
      {label}
      {showHelp && (
        <InlineHelp
          placement="bottom-right"
          text="
              The name must consist of lower case alphanumeric characters or dashes, 
              and must start and end with an alphanumeric character (e.g. 'my-name1').
              "
          className="fd-has-margin-left-tiny"
        />
      )}
    </FormLabel>
    <input
      role="input"
      className="fd-form__control"
      ref={_ref}
      type="text"
      id={id}
      placeholder={kind + ' name'}
      aria-required={required ? 'true' : 'false'}
      required={required}
      pattern={pattern}
      {...props}
    />
  </>
);

K8sNameInput.propTypes = {
  _ref: CustomPropTypes.ref,
  id: PropTypes.string,
  kind: PropTypes.string.isRequired,
  showHelp: PropTypes.bool,
  required: PropTypes.bool,
};
