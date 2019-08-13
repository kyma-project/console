import React from 'react';
import { Content, Renderers } from '@kyma-project/documentation-component';

import { CompassUIWrapper } from './styled';

export interface CompassUILayoutProps {
  renderers: Renderers;
}

export const CompassUILayout: React.FunctionComponent<CompassUILayoutProps> = ({
  renderers,
}) => (
  <CompassUIWrapper>
    <Content renderers={renderers} />
  </CompassUIWrapper>
);
