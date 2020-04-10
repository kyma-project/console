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
  currentApiState: [Source, (s: Source) => void];
  additionalTabs?: TabProps[];
}

const getNonMarkdown = (allSources: Source[]) =>
  allSources.filter(
    (s: Source) => !markdownDefinition.possibleTypes.includes(s.type),
  );

function silentRedirect(params) {
  const NODE_PARAM_PREFIX = `~`;
  // const url = URL(window.location);
  console.log(window.top.location);
}

export const GroupRenderer: React.FunctionComponent<GroupRendererProps> = ({
  sources,
  additionalTabs,
  currentApiState,
}) => {
  console.log('render');
  const [currentApi, setCurrentApi] = currentApiState;
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
    if (!currentApi || !currentApi.data) return;
    luigiClient.sendCustomMessage({
      id: 'console.silentNavigate',
      newParams: { selectedApi: currentApi.data.displayName },
    });
  }, [currentApi]);

  // useEffect(() => {
  //   if (!currentApi || !currentApi.data || !currentApi.data.displayName) return;
  //   const currentParams = luigiClient.getNodeParams();

  //   if (currentParams.selectedTab !== 'apis') {
  //     if (!currentParams.selectedApi) {
  //       return;
  //     }
  //     return luigiClient
  //       .linkManager()
  //       .withParams({ selectedTab: currentParams.selectedTab })
  //       .navigate('');
  //   }
  //   if (
  //     currentParams.selectedApi &&
  //     currentApi.data.displayName === unescape(currentParams.selectedApi)
  //   ) {
  //     return;
  //   }
  //   luigiClient
  //     .linkManager()
  //     .withParams({
  //       ...currentParams,
  //       selectedApi: currentApi.data && currentApi.data.displayName,
  //     })
  //     .navigate('');
  // }, [currentApi]);

  if (
    (!sources || !sources.length) &&
    (!additionalTabs || !additionalTabs.length)
  ) {
    return null;
  }

  const apiTabHeader = (
    <ApiTabHeader>
      <span>Displayed API:</span>
      <ApiSelector
        onApiSelect={setCurrentApi}
        sources={nonMarkdownSources}
        selectedApi={currentApi}
      />
    </ApiTabHeader>
  );

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
