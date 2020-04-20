import React from 'react';

const defaultHelpText = `
              The name must consist of lower case alphanumeric characters or dashes,
              and must start and end with an alphanumeric character (e.g. 'my-name1').
              `;

export const Input = ({
  showHelp = true,
  helpText = defaultHelpText,
  label = 'Name',
  noLabel = false,
  required = false,
  _ref = undefined,
  ...props
}) => (
  <>
    {/* {!noLabel && (
      <FormLabel required htmlFor={id}>
        {label}
        {showHelp && <InlineHelp placement="bottom-right" text={helpText} />}
      </FormLabel>
    )} */}
    <input ref={_ref} className="fd-form__control" type="text" {...props} />
  </>
);
