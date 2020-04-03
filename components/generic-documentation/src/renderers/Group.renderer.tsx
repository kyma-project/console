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
    if (!currentApi && sources.length && sources[0].type !== 'mock') {
      // a "mock" source is loaded at first, before the real data arrives
      setCurrentApi(sources[0]);
    }
  }, [currentApi, sources]);

  // useEffect(() => {
  //   const currentParams = luigiClient.getNodeParams();
  //   luigiClient
  //     .linkManager()
  //     .withParams({ ...currentParams, selectedApi: currentApi.displayName })
  //     .navigate('');
  // }, [currentApi]);

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

function sortByType(source1: Source, source2: Source): number {
  return (
    source1.type.localeCompare(source2.type) ||
    source1.rawContent.localeCompare(source2.rawContent)
  );
  // TODO:  || source1.displayName.localeCompare(source2.displayName) instead of rawContent
}

const BadgeForType: React.FunctionComponent<{ type: string }> = ({ type }) => {
  let badgeType: 'success' | 'warning' | 'error' | undefined;

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
  const [searchText, setSearchText] = useState('');
  const sortedSources = sources
    .filter((s: Source) => s.type.includes(searchText))
    .sort(sortByType);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <Combobox
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        const a = e.target as HTMLElement; // not sure why but it's needed, thank you typescript!
        if (a.tagName === 'INPUT' || a.tagName === 'BUTTON') {
          e.stopPropagation(); // avoid closing the dropdown due to the "opening" click ∞
        }
      }}
      menu={
        <List>
          {sortedSources.map((s: Source, id) => (
            <a
              aria-label="api-"
              href="#"
              onClick={e => onApiSelect(s)}
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
      placeholder={(selectedApi && selectedApi.type) || 'Select API'} // TODO: use displayName
      inputProps={{ onChange: handleInputChange }}
    />
  );
};
