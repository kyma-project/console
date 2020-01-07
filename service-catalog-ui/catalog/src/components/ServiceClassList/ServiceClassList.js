import React, { useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery } from '@apollo/react-hooks';

import {
  Spinner,
  Tab,
  Tabs,
  Tooltip,
  instancesTabUtils,
} from '@kyma-project/react-components';
import { Counter } from 'fundamental-react';

import { getAllServiceClasses } from './queries';
import { serviceClassConstants } from '../../variables';
import { determineDisplayedServiceClasses } from './searchUtils';

import Cards from './Cards/Cards.component';
import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';

import {
  ServiceClassListWrapper,
  CardsWrapper,
  ServiceClassDescription,
  EmptyList,
  StatusWrapper,
  StatusesList,
} from './styled';

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
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getAllServiceClasses, {
    variables: {
      namespace: LuigiClient.getEventData().environmentId,
    },
    fetchPolicy: 'no-cache',
  });

  if (queryLoading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  if (queryError) {
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassesList}</EmptyList>
    );
  }

  const serviceClasses = queryData.serviceClasses
    .concat(queryData.clusterServiceClasses)
    .filter(e => e.displayName || e.externalName || e.name);

  return (
    <>
      <ServiceClassToolbar
        searchFn={setSearchQuery}
        serviceClassesExists={serviceClasses.length > 0}
      />

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
