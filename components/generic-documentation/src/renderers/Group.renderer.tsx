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
import { Combobox, List, ListItem, ApiTabHeader } from './styledOther';
import { Badge } from 'fundamental-react';
import {
  markdownDefinition,
  odataDefinition,
  asyncApiDefinition,
} from '../constants';

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

export const GroupRenderer: React.FunctionComponent<GroupRendererProps> = ({
  sources,
  additionalTabs,
  currentApiState,
}) => {
  const [currentApi, setCurrentApi] = currentApiState;
  useEffect(() => {
    // console.log(sources);
    if (!currentApi && sources.length && sources[0].type !== 'mock')
      setCurrentApi(sources[0]);
  }, [currentApi, sources]);
  if (
    (!sources || !sources.length) &&
    (!additionalTabs || !additionalTabs.length)
  ) {
    return null;
  }

  const nonMarkdownSources = sources.filter(
    (s: Source) => !markdownDefinition.possibleTypes.includes(s.type),
  );

  const apiTabHeader = (
    <ApiTabHeader>
      <span>Selected an API to display:</span>
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

  // const openApiSources = getSourcesOfType(
  //   sources,
  //   openApiDefinition.possibleTypes,
  // );
  // const asyncApiSources = getSourcesOfType(sources, asyncApiTypes);
  // const odataSources = getSourcesOfType(sources, odataTypes);

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
      {tabs}
    </Tabs>
  );
};

function sortByType(source1: Source, source2: Source): number {
  return (
    source1.type.localeCompare(source2.type) ||
    source1.rawContent.localeCompare(source2.rawContent)
  );
  // TODO:  || source1.displayName.localeCompare(source2.displayName) instead of rawContent
}

const BadgeForType: React.FunctionComponent<{ type: string }> = ({ type }) => {
  let badgeType: 'success' | 'warning' | 'error' | undefined = undefined;

  if (odataDefinition.possibleTypes.includes(type)) {
    badgeType = 'warning';
  }

  if (asyncApiDefinition.possibleTypes.includes(type)) {
    badgeType = 'success';
  }

  if (markdownDefinition.possibleTypes.includes(type)) {
    badgeType = 'error';
  }

  return <Badge type={badgeType}>{type}</Badge>;
};

const ApiSelector: React.FunctionComponent<{
  sources: Source[];
  onApiSelect: (api: Source) => void;
  selectedApi: Source;
}> = ({ sources, onApiSelect, selectedApi }) => {
  const sortedSources = sources.sort(sortByType);
  console.log('rendering api selector');

  return (
    <Combobox
      onClick={(e: MouseEvent) => e.stopPropagation()}
      menu={
        <List>
          {sortedSources.map((s: Source, id) => (
            <a
              href="#"
              onClick={e => {
                onApiSelect(s);
              }}
              className="fd-menu__item"
              key={s.rawContent}
            >
              <ListItem>
                <BadgeForType type={s.type} />
                {s.type} {id}
              </ListItem>
            </a>
          ))}
        </List>
      }
      placeholder={(selectedApi && selectedApi.type) || 'Select API'} //TODO: use displayName
      // inputProps={{ value: selectedApi.type }}
    />
  );
};
