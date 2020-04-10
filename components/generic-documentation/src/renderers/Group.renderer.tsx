import React, { useEffect, useState } from 'react';
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

import { SingleAPIcontent } from './SingleAPIcontent';
import { ApiTabHeader } from './helpers/styled';
import ApiSelector from './helpers/ApiSelector';

import { markdownDefinition } from '../constants';
import unescape from 'lodash.unescape';

export enum TabsLabels {
  DOCUMENTATION = 'Documentation',
  CONSOLE = 'Console',
  EVENTS = 'Events',
  ODATA = 'OData',
}

export interface GroupRendererProps extends GroupRendererComponent {
  externalState: {
    currentApiState: [Source, (s: Source) => void];
    currentTabState: [string, (s: string) => void];
  };
  additionalTabs?: TabProps[];
}

const getNonMarkdown = (allSources: Source[]) =>
  allSources.filter(
    (s: Source) => !markdownDefinition.possibleTypes.includes(s.type),
  );

export const GroupRenderer: React.FunctionComponent<GroupRendererProps> = ({
  sources,
  additionalTabs,
  externalState,
}) => {
  const [currentApi, setCurrentApi] = externalState.currentApiState;
  const [currentTab, setCurrentTab] = externalState.currentTabState;

  const nonMarkdownSources = getNonMarkdown(sources);

  useEffect(() => {
    if (currentApi) return;

    const apiNameFromURL = unescape(luigiClient.getNodeParams().selectedApi);
    if (apiNameFromURL) {
      const matchedSource = sources.find(
        (s: Source) => s.data && s.data.displayName === apiNameFromURL,
      );
      if (matchedSource) {
        setCurrentApi(matchedSource);
        return;
      }
    }

    if (nonMarkdownSources.length && nonMarkdownSources[0].type !== 'mock') {
      // a "mock" source is loaded at first, before the real data arrives
      setCurrentApi(nonMarkdownSources[0]);
    }
  }, [currentApi, sources]);

  useEffect(() => {
    luigiClient.sendCustomMessage({
      id: 'console.silentNavigate',
      newParams: {
        selectedApi:
          currentApi && currentApi.data
            ? currentApi.data.displayName
            : undefined,
      },
    });
  }, [currentApi]);

  useEffect(() => {
    luigiClient.sendCustomMessage({
      id: 'console.silentNavigate',
      newParams: {
        selectedTab: currentTab || undefined,
      },
    });
  }, [currentTab]);

  const apiTabHeader = (
    <ApiTabHeader>
      <span>API</span>
      <ApiSelector
        onApiSelect={setCurrentApi}
        sources={nonMarkdownSources}
        selectedApi={currentApi}
      />
    </ApiTabHeader>
  );

  const handleTabChange = (tabId: string): void => {
    setCurrentTab(tabId);
  };

  const markdownsExists = sources.some(source =>
    markdownDefinition.possibleTypes.includes(source.type),
  );

  const additionalTabsFragment =
    additionalTabs &&
    additionalTabs.map(tab => (
      <Tab label={tab.label} id={tab.id} key={tab.id}>
        {tab.children}
      </Tab>
    ));

  return (
    <Tabs
      active={currentTab}
      onChangeTab={{
        func: handleTabChange,
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
                    <RenderedContent
                      sourceTypes={markdownDefinition.possibleTypes}
                    />
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
      {!!nonMarkdownSources.length && (
        <Tab label={apiTabHeader} id="apis">
          {currentApi && <SingleAPIcontent source={currentApi} />}
        </Tab>
      )}
      {additionalTabsFragment}
    </Tabs>
  );
};
