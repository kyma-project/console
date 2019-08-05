import React from 'react';
import {
  Source,
  RenderedContent,
  GroupRendererComponent,
} from '@kyma-project/documentation-component';

import { StickyContainer, Sticky } from 'react-sticky';
import { HeadersNavigation } from '../render-engines/markdown/headers-toc';
import { Grid, Tabs, Tab } from '../components';
import { MarkdownWrapper } from '../styled';
import {
  markdownTypes,
  openApiTypes,
  asyncApiTypes,
  odataTypes,
} from '../constants';
import { StyledAsyncApi, StyledOData } from './styled';
import { StyledSwagger } from '../render-engines/open-api/styles';

function existsFiles(sources: Source[], types: string[]) {
  return sources.find(source => types.includes(source.type));
}

export interface GroupRendererProps extends GroupRendererComponent {
  additionalTabs?: Array<{
    label: string;
    content: React.ReactNode;
  }>;
}

export const GroupRenderer: React.FunctionComponent<GroupRendererProps> = ({
  sources,
  additionalTabs,
}) => {
  if (
    (!sources || !sources.length) &&
    (!additionalTabs || !additionalTabs.length)
  ) {
    return null;
  }

  const markdownsExists = existsFiles(sources, markdownTypes);
  const openApiExists = existsFiles(sources, openApiTypes);
  const asyncApiExists = existsFiles(sources, asyncApiTypes);
  const odataExists = existsFiles(sources, odataTypes);

  const tabs =
    additionalTabs &&
    additionalTabs.map(tab => (
      <Tab label={tab.label} key={tab.label}>
        {tab.content}
      </Tab>
    ));

  return (
    <Tabs>
      {markdownsExists && (
        <Tab label="Documentation">
          <MarkdownWrapper className="custom-markdown-styling">
            <Grid.Container className="grid-container">
              <StickyContainer>
                <Grid.Row>
                  <Grid.Unit df={9} sm={12} className="grid-unit-content">
                    <RenderedContent sourceTypes={markdownTypes} />
                  </Grid.Unit>
                  <Grid.Unit df={3} sm={0} className="grid-unit-navigation">
                    <Sticky>
                      {({ style }: any) => (
                        <div style={{ ...style, zIndex: 200 }}>
                          <HeadersNavigation enableSmoothScroll={true} />
                        </div>
                      )}
                    </Sticky>
                  </Grid.Unit>
                </Grid.Row>
              </StickyContainer>
            </Grid.Container>
          </MarkdownWrapper>
        </Tab>
      )}
      {openApiExists && (
        <Tab label="Console">
          <StyledSwagger className="custom-open-api-styling">
            <RenderedContent sourceTypes={openApiTypes} />
          </StyledSwagger>
        </Tab>
      )}
      {asyncApiExists && (
        <Tab label="Events">
          <StyledAsyncApi className="custom-async-api-styling">
            <RenderedContent sourceTypes={asyncApiTypes} />
          </StyledAsyncApi>
        </Tab>
      )}
      {odataExists && (
        <Tab label="OData">
          <StyledOData className="custom-odata-styling">
            <RenderedContent sourceTypes={odataTypes} />
          </StyledOData>
        </Tab>
      )}
      {tabs}
    </Tabs>
  );
};
