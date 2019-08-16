import React from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';

import { GroupRenderer } from '../renderers';
import { CatalogUIWrapper } from './styled';

export interface CatalogUILayoutProps {
  renderers: Renderers;
  additionalTabs?: React.ReactNodeArray;
  tabRouteHandler?: object;
}

export const CatalogUILayout: React.FunctionComponent<CatalogUILayoutProps> = ({
  renderers,
  additionalTabs,
  tabRouteHandler,
}) => {
  renderers.group = (otherProps: any) => (
    <GroupRenderer
      {...otherProps}
      additionalTabs={additionalTabs}
      tabRouteHandler={tabRouteHandler}
    />
  );

  return (
    <CatalogUIWrapper>
      <Content renderers={renderers} />
    </CatalogUIWrapper>
  );
};
