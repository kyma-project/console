import React from 'react';

import { Alert } from 'fundamental-react';

const invalidGroupMessage =
  "The user group name has the wrong format. The name must consist of lower case alphanumeric characters, dashes or dots, and must start and end with an alphanumeric character (e.g. 'my-name').";

export default function InvalidGroupMessage() {
  return (
    <Alert className="fd-has-type-0" dismissible={false} type="error">
      {invalidGroupMessage}
    </Alert>
  );
}
