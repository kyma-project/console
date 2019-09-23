import React from 'react';

import { ASYNCAPI_SCHEMA, OPENAPI_SCHEMA } from '../../constants';
import AsyncAPIComponent from '../AsyncAPI/AsyncAPI';
import OpenAPIComponent from '../OpenAPI/OpenAPI';

function DocumentationComponent({ content, type }) {
  switch (type) {
    case ASYNCAPI_SCHEMA:
      return <AsyncAPIComponent schema={content} />;
    case OPENAPI_SCHEMA:
      return <OpenAPIComponent schema={content} />;
    default:
      return null;
  }
}

export default DocumentationComponent;
