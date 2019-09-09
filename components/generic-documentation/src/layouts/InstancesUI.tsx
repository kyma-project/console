import React from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';

import { GroupRenderer } from '../renderers';
import { InstancesUIWrapper } from './styled';

export interface InstancesUILayoutProps {
  renderers: Renderers;
}

export const InstancesUILayout: React.FunctionComponent<
  InstancesUILayoutProps
> = ({ renderers }) => {
  renderers.group = (props: any) => <GroupRenderer {...props} />;

  return (
    <InstancesUIWrapper>
      <Content renderers={renderers} />
    </InstancesUIWrapper>
  );
};
