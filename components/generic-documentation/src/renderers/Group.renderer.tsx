import React, { useEffect } from 'react';
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
  selectedApiState: [Source, (s: Source) => void];

  additionalTabs?: TabProps[];
}

const getNonMarkdown = (allSources: Source[]) =>
  allSources.filter(
    (s: Source) => !markdownDefinition.possibleTypes.includes(s.type),
  );

function sortByType(source1: Source, source2: Source): number {
  return (
    source1.type.localeCompare(source2.type) ||
    (source1.data &&
      source2.data &&
      source1.data.displayName &&
      source1.data.displayName.localeCompare(source2.data.displayName))
  );
}

export const GroupRenderer: React.FunctionComponent<GroupRendererProps> = ({
  sources,
  additionalTabs,
  selectedApiState,
}) => {
  const [selectedApi, setSelectedApi] = selectedApiState;
  const sortedSources = sources.sort(sortByType);
  const nonMarkdownSources = getNonMarkdown(sortedSources);

  useEffect(() => {
    if (selectedApi) return;

    const apiNameFromURL = unescape(luigiClient.getNodeParams().selectedApi);
    if (apiNameFromURL) {
      const matchedSource = sortedSources.find(
        (s: Source) => s.data && s.data.displayName === apiNameFromURL,
      );
      if (matchedSource) {
        setSelectedApi(matchedSource);
        return;
      }
    }

    if (nonMarkdownSources.length && nonMarkdownSources[0].type !== 'mock') {
      // a "mock" source is loaded at first, before the real data arrives
      setSelectedApi(nonMarkdownSources[0]);
    }
  }, [selectedApi, sortedSources]);

  useEffect(() => {
    luigiClient.sendCustomMessage({
      id: 'console.silentNavigate',
      newParams: {
        selectedApi:
          selectedApi && selectedApi.data
            ? selectedApi.data.displayName
            : undefined,
      },
    });
  }, [selectedApi]);

  const apiTabHeader = (
    <ApiTabHeader>
      <span>API</span>
      <ApiSelector
        onApiSelect={setSelectedApi}
        sources={nonMarkdownSources}
        selectedApi={selectedApi}
      />
    </ApiTabHeader>
  );

  const handleTabChange = (id: string): void => {
    try {
      luigiClient
        .linkManager()
        .withParams({ selectedTab: id })
        .navigate('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleTabInit = (): string =>
    luigiClient.getNodeParams().selectedTab || '';

  const markdownsExists = sortedSources.some(source =>
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
      onInit={handleTabInit}
      onChangeTab={{
        func: handleTabChange,
        preventDefault: true,
      }}
    >
      {markdownsExists && (
        <Tab label={TabsLabels.DOCUMENTATION} id={TabsLabels.DOCUMENTATION}>
          <MarkdownWrapper className="custom-markdown-styling">
            <Grid.Container width="auto" className="grid-container">
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
          {selectedApi && <SingleAPIcontent source={selectedApi} />}
        </Tab>
      )}
      {additionalTabsFragment}
    </Tabs>
  );
};
