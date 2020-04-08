import React, { useState } from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';
import { luigiClient } from '@kyma-project/common';
import { GroupRenderer } from '../renderers';
import { InstancesUIWrapper } from './styled';

export interface InstancesUILayoutProps {
  renderers: Renderers;
}

export const InstancesUILayout: React.FunctionComponent<
  InstancesUILayoutProps
> = ({ renderers }) => {
  const currentApiState = useState(luigiClient.getNodeParams().selectedApi); // will be undefined until displayName is done

  renderers.group = (otherProps: any) => (
    <GroupRenderer {...otherProps} currentApiState={currentApiState} />
  );

  return (
    <InstancesUIWrapper>
      <Content renderers={renderers} />
    </InstancesUIWrapper>
  );
};
