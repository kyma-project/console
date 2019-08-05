import React from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';

import { GroupRenderer } from '../renderers';
import { CatalogUIWrapper } from './styled';

export interface CatalogUILayoutProps {
  renderers: Renderers;
  additionalTabs?: React.ReactNodeArray;
}

export const CatalogUILayout: React.FunctionComponent<CatalogUILayoutProps> = ({
  renderers,
  additionalTabs,
}) => {
  renderers.group = (otherProps: any) => (
    <GroupRenderer {...otherProps} additionalTabs={additionalTabs} />
  );

  return (
    <CatalogUIWrapper>
      <Content renderers={renderers} />
    </CatalogUIWrapper>
  );
};
