import React from 'react';

import { TabsLabels } from './Group.renderer';

import { StyledOData, StyledAsyncAPI } from './styled';
import { StyledSwagger } from '../render-engines/open-api/styles';
import { Source } from '@kyma-project/documentation-component';

function getStyledAPIComponent(apiType: TabsLabels): React.ElementType {
  switch (apiType) {
    case TabsLabels.CONSOLE:
      return StyledSwagger;
    case TabsLabels.EVENTS:
      return StyledAsyncAPI;
    case TabsLabels.ODATA:
      return StyledOData;
    default:
      return StyledSwagger;
  }
}

export interface SingleAPIcontent {
  apiLabel: TabsLabels;
  apiClassName: string;
  source: Source;
}

export const SingleAPIcontent: React.FunctionComponent<SingleAPIcontent> = ({
  apiLabel = TabsLabels.CONSOLE,
  apiClassName = 'custom-open-api-styling',
  source,
}) => {
  const StyledComponent = getStyledAPIComponent(apiLabel);

  return (
    <StyledComponent className={apiClassName}>
      <>{source.data ? source.data.renderedContent : null}</>
    </StyledComponent>
  );
};
