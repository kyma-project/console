import React from 'react';
import { GenericDocumentation } from '@kyma-project/generic-documentation';

function DocumentationComponent({ content, type }) {
  return (
    <GenericDocumentation
      layout="compass-ui"
      sources={[
        {
          source: {
            rawContent: content,
            type,
          },
        },
      ]}
    />
  );
}

export default DocumentationComponent;
