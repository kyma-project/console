import React from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';

import { GroupRenderer } from '../renderers';
import { InstancesUIWrapper } from './styled';

export interface InstancesUILayoutProps {
  renderers: Renderers;
  tabRouteHandler?: object;
}

export const InstancesUILayout: React.FunctionComponent<
  InstancesUILayoutProps
> = ({ renderers, tabRouteHandler }) => {
  renderers.group = (props: any) => (
    <GroupRenderer tabRouteHandler={tabRouteHandler} {...props} />
  );

  return (
    <InstancesUIWrapper>
      <Content renderers={renderers} />
    </InstancesUIWrapper>
  );
};
