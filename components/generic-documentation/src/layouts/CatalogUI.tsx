import React, { useState } from 'react';
import {
  Content,
  Renderers,
  Source,
} from '@kyma-project/documentation-component';
import { GroupRenderer } from '../renderers';
import { CatalogUIWrapper } from './styled';
import { luigiClient } from '@kyma-project/common';

export interface CatalogUILayoutProps {
  renderers: Renderers;
  additionalTabs?: React.ReactNodeArray;
}

export const CatalogUILayout: React.FunctionComponent<CatalogUILayoutProps> = ({
  renderers,
  additionalTabs,
}) => {
  const externalState = {
    selectedApiState: useState<Source | undefined>(),
    selectedTabState: useState<string>(luigiClient.getNodeParams().selectedTab),
  };

  renderers.group = (otherProps: any) => (
    <GroupRenderer
      {...otherProps}
      externalState={externalState}
      additionalTabs={additionalTabs}
    />
  );

  return (
    <CatalogUIWrapper>
      <Content renderers={renderers} />
    </CatalogUIWrapper>
  );
};
