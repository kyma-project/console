import React, { useState } from 'react';
import {
  Content,
  Renderers,
  Source,
} from '@kyma-project/documentation-component';
import { GroupRenderer } from '../renderers';
import { InstancesUIWrapper } from './styled';
import { luigiClient } from '@kyma-project/common';

export interface InstancesUILayoutProps {
  renderers: Renderers;
}

export const InstancesUILayout: React.FunctionComponent<
  InstancesUILayoutProps
> = ({ renderers }) => {
  const externalState = {
    selectedApiState: useState<Source | undefined>(),
    selectedTabState: useState<string>(luigiClient.getNodeParams().selectedTab),
  };

  renderers.group = (otherProps: any) => (
    <GroupRenderer {...otherProps} externalState={externalState} />
  );

  return (
    <InstancesUIWrapper>
      <Content renderers={renderers} />
    </InstancesUIWrapper>
  );
};
