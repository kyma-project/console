import React, { useState } from 'react';
import {
  Content,
  Renderers,
  Source,
} from '@kyma-project/documentation-component';
import { GroupRenderer } from '../renderers';
import { InstancesUIWrapper } from './styled';

export interface InstancesUILayoutProps {
  renderers: Renderers;
}

export const InstancesUILayout: React.FunctionComponent<InstancesUILayoutProps> = ({
  renderers,
}) => {
  const selectedApiState = useState<Source | undefined>();

  renderers.group = (otherProps: any) => (
    <GroupRenderer {...otherProps} selectedApiState={selectedApiState} />
  );

  return (
    <InstancesUIWrapper>
      <Content renderers={renderers} />
    </InstancesUIWrapper>
  );
};
