import React, { useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery } from '@apollo/react-hooks';

import { instancesTabUtils } from '@kyma-project/react-components';
import { Tab, Tabs, Spinner, Tooltip } from 'react-shared';
import { Identifier } from 'fundamental-react';

import { getAllServiceClasses } from './queries';
import { serviceClassConstants } from 'helpers/constants';
import { determineDisplayedServiceClasses } from 'helpers/search';

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
    <StatusesList key={id}>
      <StatusWrapper>
        <Identifier size="xxs" data-e2e-id={id}>
          {data}
        </Identifier>
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
      namespace: LuigiClient.getContext().namespaceId,
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
        className="header-styles"
      >
        <Tab
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
            <Tooltip title={serviceClassConstants.servicesTooltipDescription}>
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
        <Tab
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
            <Tooltip title={serviceClassConstants.addonsTooltipDescription}>
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
      </Tabs>
    </>
  );
}
