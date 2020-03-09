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
  odataTypes,
  asyncApiTypes,
  openApiTypes,
} from '../constants';
import { SingleAPIcontent } from './SingleAPIcontent';

function existFiles(sources: Source[], types: string[]) {
  return sources.find(source => types.includes(source.type));
}

function getSourcesOfType(sources: Source[], types: string[]): Source[] {
  return sources.filter(source => types.includes(source.type)).sort();
}

export enum TabsLabels {
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

  const openApiSources = getSourcesOfType(sources, openApiTypes);
  const asyncApiSources = getSourcesOfType(sources, asyncApiTypes);
  const odataSources = getSourcesOfType(sources, odataTypes);

  const tabs =
    additionalTabs &&
    additionalTabs.map(tab => (
      <Tab label={tab.label} id={tab.id} key={tab.id}>
        {tab.children}
      </Tab>
    ));

  return (
    <Tabs
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

      {openApiSources.map((source: Source, id: number) => {
        const label =
          TabsLabels.CONSOLE + (openApiSources.length > 1 ? ` ${id + 1}` : '');
        return (
          <Tab label={label} id={label}>
            <SingleAPIcontent
              apiLabel={TabsLabels.CONSOLE}
              apiClassName="custom-open-api-styling"
              source={source}
            />
          </Tab>
        );
      })}
      {asyncApiSources.map((source: Source, id: number) => {
        const label =
          TabsLabels.EVENTS + (asyncApiSources.length > 1 ? ` ${id + 1}` : '');
        return (
          <Tab label={label} id={label}>
            <SingleAPIcontent
              apiLabel={TabsLabels.EVENTS}
              apiClassName="custom-async-api-styling"
              source={source}
            />
          </Tab>
        );
      })}
      {odataSources.map((source: Source, id: number) => {
        const label =
          TabsLabels.ODATA + (odataSources.length > 1 ? ` ${id + 1}` : '');
        return (
          <Tab label={label} id={label}>
            <SingleAPIcontent
              apiLabel={TabsLabels.ODATA}
              apiClassName="custom-odata-styling"
              source={source}
            />
          </Tab>
        );
      })}
      {tabs}
    </Tabs>
  );
};
