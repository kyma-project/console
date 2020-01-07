import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  GenericDocumentation,
  LayoutType,
} from '@kyma-project/generic-documentation';

import { ClusterAssetGroupsService } from '../services';
import { ContentWrapper } from './styled';

export const Content: React.FunctionComponent<RouteComponentProps> = () => {
  const { activeClusterAssetGroup } = useContext(ClusterAssetGroupsService);

  if (!activeClusterAssetGroup) {
    return null;
  }

  return (
    <ContentWrapper>
      <h1 data-e2e-id="toolbar-header">
        {activeClusterAssetGroup.displayName}
      </h1>
      <GenericDocumentation
        assetGroup={activeClusterAssetGroup}
        layout={LayoutType.CONTENT_UI}
      />
    </ContentWrapper>
  );
};
