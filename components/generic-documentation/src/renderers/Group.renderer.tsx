import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import {
  Source,
  RenderedContent,
  GroupRendererComponent,
} from '@kyma-project/documentation-component';
import { luigiClient } from '@kyma-project/common';
import { Grid, Tabs, Tab, TabProps } from '@kyma-project/components';

import { HeadersNavigation } from '../render-engines/markdown/headers-toc';
import { MarkdownWrapper } from '../styled';
import {
  markdownTypes,
  openApiTypes,
  asyncApiTypes,
  odataTypes,
} from '../constants';
import { StyledOData, StyledAsyncAPI } from './styled';
import { StyledSwagger } from '../render-engines/open-api/styles';

function existFiles(sources: Source[], types: string[]) {
  return sources.find(source => types.includes(source.type));
}

enum TabsLabels {
  DOCUMENTATION = 'Documentation',
  CONSOLE = 'Console',
  EVENTS = 'Events',
  ODATA = 'OData',
}

export interface GroupRendererProps extends GroupRendererComponent {
  additionalTabs?: TabProps[];
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

  const onChangeTab = (id: string): void => {
    try {
      luigiClient
        .linkManager()
        .withParams({ selectedTab: id })
        .navigate('');
    } catch (e) {
      console.error(e);
    }
  };

  const onInitTabs = (): string =>
    luigiClient.getNodeParams().selectedTab || '';

  const markdownsExists = existFiles(sources, markdownTypes);
  const openApiExists = existFiles(sources, openApiTypes);
  const asyncApiExists = existFiles(sources, asyncApiTypes);
  const odataExists = existFiles(sources, odataTypes);

  const tabs =
    additionalTabs &&
    additionalTabs.map(tab => (
      <Tab label={tab.label} id={tab.id} key={tab.id}>
        {tab.children}
      </Tab>
    ));

  return (
    <Tabs
      active={TabsLabels.DOCUMENTATION}
      onInit={onInitTabs}
      onChangeTab={{
        func: onChangeTab,
        preventDefault: true,
      }}
    >
      {markdownsExists && (
        <Tab label={TabsLabels.DOCUMENTATION} id={TabsLabels.DOCUMENTATION}>
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
        <Tab label={TabsLabels.CONSOLE} id={TabsLabels.CONSOLE}>
          <StyledSwagger className="custom-open-api-styling">
            <RenderedContent sourceTypes={openApiTypes} />
          </StyledSwagger>
        </Tab>
      )}
      {asyncApiExists && (
        <Tab label={TabsLabels.EVENTS} id={TabsLabels.EVENTS}>
          <StyledAsyncAPI className="custom-async-api-styling">
            <RenderedContent sourceTypes={asyncApiTypes} />
          </StyledAsyncAPI>
        </Tab>
      )}
      {odataExists && (
        <Tab label={TabsLabels.ODATA} id={TabsLabels.ODATA}>
          <StyledOData className="custom-odata-styling">
            <RenderedContent sourceTypes={odataTypes} />
          </StyledOData>
        </Tab>
      )}
      {tabs}
    </Tabs>
  );
};
