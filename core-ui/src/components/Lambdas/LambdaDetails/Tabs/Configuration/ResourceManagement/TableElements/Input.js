import React from 'react';
import PropTypes from 'prop-types';
import { InlineHelp, FormLabel } from 'fundamental-react';

const defaultHelpText = `
              The name must consist of lower case alphanumeric characters or dashes, 
              and must start and end with an alphanumeric character (e.g. 'my-name1').
              `;

export const Input = ({
  id,
  showHelp = true,
  helpText = defaultHelpText,
  label = 'Name',
  noLabel = false,
  required = false,
  ...props
}) => (
  <>
    {/* {!noLabel && (
      <FormLabel required htmlFor={id}>
        {label}
        {showHelp && <InlineHelp placement="bottom-right" text={helpText} />}
      </FormLabel>
    )} */}
    <input
      // role="input"
      className="fd-form__control"
      id={id}
      type="text"
      required={required}
      pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
      {...props}
    />
  </>
);

Input.propTypes = {
  id: PropTypes.string,
  showHelp: PropTypes.bool,
};
