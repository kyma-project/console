import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { Content, Renderers } from '@kyma-project/documentation-component';
import { Grid } from '@kyma-project/components';

import { HeadersNavigation } from '../render-engines/markdown/headers-toc';

export interface ContentUILayoutProps {
  renderers: Renderers;
}

export const ContentUILayout: React.FunctionComponent<ContentUILayoutProps> = ({
  renderers,
}) => (
  <Grid.Container className="grid-container">
    <StickyContainer>
      <Grid.Row>
        <Grid.Unit df={9} sm={12} className="grid-unit-content">
          <Content renderers={renderers} />
        </Grid.Unit>
        <Grid.Unit df={3} sm={0} className="grid-unit-navigation">
          <Sticky>
            {({ style }: any) => (
              <div style={{ ...style, zIndex: 200 }}>
                <HeadersNavigation />
              </div>
            )}
          </Sticky>
        </Grid.Unit>
      </Grid.Row>
    </StickyContainer>
  </Grid.Container>
);
