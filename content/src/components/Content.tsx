import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  GenericComponent,
  LayoutType,
} from '@kyma-project/generic-documentation';

import { DocsTopicsService } from '../services';
import { ContentWrapper } from './styled';

export const Content: React.FunctionComponent<RouteComponentProps> = () => {
  const { activeDocsTopic } = useContext(DocsTopicsService);

  if (!activeDocsTopic) {
    return null;
  }

  return (
    <ContentWrapper>
      <h1 data-e2e-id="toolbar-header">{activeDocsTopic.displayName}</h1>
      <GenericComponent
        docsTopic={activeDocsTopic}
        layout={LayoutType.CONTENT_UI}
      />
    </ContentWrapper>
  );
};
