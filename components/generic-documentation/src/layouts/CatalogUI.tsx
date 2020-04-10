import React, { useState } from 'react';
import {
  Content,
  Renderers,
  Source,
} from '@kyma-project/documentation-component';
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
  const selectedApiState = useState<Source | undefined>();

  renderers.group = (otherProps: any) => (
    <GroupRenderer
      {...otherProps}
      selectedApiState={selectedApiState}
      additionalTabs={additionalTabs}
    />
  );

  return (
    <CatalogUIWrapper>
      <Content renderers={renderers} />
    </CatalogUIWrapper>
  );
};
