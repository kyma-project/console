import React from 'react';

import { Source } from '@kyma-project/documentation-component';

import {
  ApiDefinition,
  openApiDefinition,
  odataDefinition,
  markdownDefinition,
  asyncApiDefinition,
} from '../constants';

function getApiDefinitionOfType(type: string): ApiDefinition {
  return (
    [
      markdownDefinition,
      openApiDefinition,
      asyncApiDefinition,
      odataDefinition,
    ].find((definition: ApiDefinition) =>
      definition.possibleTypes.includes(type),
    ) || openApiDefinition
  );
}

export const SingleAPIcontent: React.FunctionComponent<{
  source: Source;
}> = ({ source }) => {
  const apiDefinition = getApiDefinitionOfType(source.type);
  const Wrapper = apiDefinition.styledComponent;

  if (Wrapper) {
    return (
      <Wrapper className={apiDefinition.stylingClassName}>
        <>{source.data ? source.data.renderedContent : null}</>
      </Wrapper>
    );
  } else {
    return <>{source.data ? source.data.renderedContent : null}</>;
  }
};
