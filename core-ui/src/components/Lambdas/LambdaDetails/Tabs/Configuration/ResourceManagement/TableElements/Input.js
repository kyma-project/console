import React from 'react';

export const Input = ({ _ref = undefined, ...props }) => (
  <input ref={_ref} className="fd-form__control" type="text" {...props} />
);
