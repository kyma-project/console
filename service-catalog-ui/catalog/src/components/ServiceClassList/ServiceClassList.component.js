import React, { useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery } from '@apollo/react-hooks';

import {
  NotificationMessage,
  Search,
  Spinner,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  instancesTabUtils,
} from '@kyma-project/react-components';
import { Counter } from 'fundamental-react';

import builder from '../../commons/builder';
import { getAllServiceClasses } from './queries';
import { serviceClassConstants } from '../../variables';
import Cards from './Cards/Cards.component';
import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';

import {
  SearchWrapper,
  ServiceClassListWrapper,
  CardsWrapper,
  ServiceClassDescription,
  EmptyList,
  StatusWrapper,
  StatusesList,
} from './styled';

const determineDisplayedServiceClasses = (
  serviceClasses,
  tabIndex,
  searchQuery,
  activeLabels,
) => {
  console.log(
    'determineDisplayedServiceClasses serviceClasses',
    serviceClasses,
    'tabIndex',
    tabIndex,
    'searchQuery',
    searchQuery,
    'activeLabels',
    activeLabels,
  );

  const searched = serviceClasses.filter(item =>
    new RegExp(searchQuery, 'i').test(item.name),
  );

  const filteredByLabels = searched.filter(item =>
    activeLabels.every(activeLabel => item.labels.includes(activeLabel)),
  );

  let filteredByTab = [];
  if (tabIndex === serviceClassConstants.addonsIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local === 'true';
      }
      return false;
    });
  }
  if (tabIndex === serviceClassConstants.servicesIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local !== 'true';
      }
      return true;
    });
  }

  return filteredByTab;
};

const determineAvailableLabels = (serviceClasses, tabName, searchQuery) => {
  // const displayedInstances = determineDisplayedServiceClasses(
  //   serviceClasses,
  //   tabName,
  //   searchQuery,
  //   [],
  // );
  // const allLabels = serviceClasses.reduce(
  //   (labelsCombined, item) => [...labelsCombined, ...item.labels],
  //   [],
  // );
  // const labelsWithOccurrences = allLabels.reduce(
  //   (labelsWithOccurrences, label) => ({
  //     ...labelsWithOccurrences,
  //     [label]: 0,
  //   }),
  //   {},
  // );
  // displayedInstances.forEach(item => {
  //   item.labels.forEach(label => {
  //     ++labelsWithOccurrences[label];
  //   });
  // });
  // return labelsWithOccurrences;
};

const determineSelectedTab = () => {
  const selectedTabName = LuigiClient.getNodeParams().selectedTab;
  return instancesTabUtils.convertTabNameToIndex(selectedTabName);
};

const handleTabChange = ({ defaultActiveTabIndex }) => {
  const selectedTabName = instancesTabUtils.convertIndexToTabName(
    defaultActiveTabIndex,
  );

  LuigiClient.linkManager()
    .withParams({ selectedTab: selectedTabName })
    .navigate('');
};

const status = (data, id) => {
  return (
    <StatusesList>
      <StatusWrapper key={id}>
        <Counter data-e2e-id={id}>{data}</Counter>
      </StatusWrapper>
    </StatusesList>
  );
};

export default function ServiceClassList() {
  const [serviceClasses, setServiceClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLabelFilters, setActiveLabelFilters] = useState([]);

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getAllServiceClasses, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
  });

  useEffect(() => {
    if (queryData && queryData.serviceClasses && !queryLoading && !queryError) {
      setServiceClasses(
        queryData.serviceClasses
          .concat(queryData.clusterServiceClasses)
          .filter(e => e.displayName || e.externalName || e.name),
      );
    }
  }, [queryData, queryLoading, queryError]);

  if (queryLoading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  if (queryError) {
    return (
      <EmptyList>
        An error occurred while loading Service Instances List
      </EmptyList>
    );
  }

  const handleLabelChange = (labelId, checked) => {
    if (checked) {
      setActiveLabelFilters([...activeLabelFilters, labelId]);
    } else {
      setActiveLabelFilters(
        [...activeLabelFilters].filter(label => label !== labelId),
      );
    }
  };

  // let items = classList.filteredServiceClasses || [];

  // // TODO: Remove this nasty workaround for apparent bug
  // // https://github.com/apollographql/apollo-client/issues/2920
  // // Possible solution: do resolver logic on component side
  // items = items.map(entry => {
  //   const remoteEntry = serviceClasses.find(remoteEntry => {
  //     if (remoteEntry.name) return remoteEntry.name === entry.name;
  //     if (remoteEntry.externalName) {
  //       return remoteEntry.externalName === entry.externalName;
  //     }
  //     return remoteEntry.displayName === entry.displayName;
  //   });

  //   return {
  //     ...entry,
  //     ...remoteEntry,
  //   };
  // });

  //its used for filtering class which does not have any name in it (either externalName, displayName or name).
  // items = items.filter(e => e.displayName || e.externalName || e.name);

  return (
    <>
      <ServiceClassToolbar
        searchFn={setSearchQuery}
        onLabelChange={handleLabelChange}
        activeLabelFilters={activeLabelFilters}
        availableLabels={determineAvailableLabels(
          serviceClasses,
          determineSelectedTab(),
          searchQuery,
        )}
        serviceClassesExists={serviceClasses.length > 0}
      />
      <Toolbar title={serviceClassConstants.title} background="#fff">
        <SearchWrapper>
          <Search
            noSearchBtn
            placeholder="Search"
            onChange={e => setSearchQuery(e.target.value)}
            data-e2e-id="search"
          />
        </SearchWrapper>
      </Toolbar>

      <Tabs
        defaultActiveTabIndex={determineSelectedTab()}
        callback={handleTabChange}
        borderType="none"
        noMargin
        customStyles
        hideSeparator
      >
        <Tab
          noMargin
          status={status(
            determineDisplayedServiceClasses(
              serviceClasses,
              serviceClassConstants.addonsIndex,
              searchQuery,
              [],
            ).length,
            'addons-status',
          )}
          title={
            <Tooltip
              content={serviceClassConstants.addonsTooltipDescription}
              minWidth="100px"
              showTooltipTimeout={750}
              key="catalog-addons-tab-tooltip"
            >
              {serviceClassConstants.addons}
            </Tooltip>
          }
        >
          <>
            <ServiceClassDescription>
              {serviceClassConstants.addonsDescription}
              {/* {renderFilters()} */}
            </ServiceClassDescription>
            <ServiceClassListWrapper>
              <CardsWrapper data-e2e-id="cards">
                <Cards
                  data-e2e-id="cards"
                  items={determineDisplayedServiceClasses(
                    serviceClasses,
                    serviceClassConstants.addonsIndex,
                    searchQuery,
                    [],
                  )}
                />
              </CardsWrapper>
            </ServiceClassListWrapper>
          </>
        </Tab>
        <Tab
          noMargin
          status={status(
            determineDisplayedServiceClasses(
              serviceClasses,
              serviceClassConstants.servicesIndex,
              searchQuery,
              [],
            ).length,
            'services-status',
          )}
          title={
            <Tooltip
              content={serviceClassConstants.servicesTooltipDescription}
              minWidth="140px"
              showTooltipTimeout={750}
              key="catalog-services-tab-tooltip"
            >
              {serviceClassConstants.services}
            </Tooltip>
          }
        >
          <>
            <ServiceClassDescription>
              {serviceClassConstants.servicesDescription}
              {/* {renderFilters()} */}
            </ServiceClassDescription>
            <ServiceClassListWrapper>
              <CardsWrapper data-e2e-id="cards">
                <Cards
                  data-e2e-id="cards"
                  items={determineDisplayedServiceClasses(
                    serviceClasses,
                    serviceClassConstants.servicesIndex,
                    searchQuery,
                    [],
                  )}
                />
              </CardsWrapper>
            </ServiceClassListWrapper>
          </>
        </Tab>
      </Tabs>
    </>
  );
}
