import React, { useState } from 'react';
import LuigiClient from '@luigi-project/client';

import { instancesTabUtils } from '@kyma-project/react-components';
import {
  Tab,
  Tabs,
  Spinner,
  Tooltip,
  useGetList,
  useMicrofrontendContext,
} from 'react-shared';
import { Identifier } from 'fundamental-react';

import { serviceClassConstants } from 'helpers/constants';
import { determineDisplayedItems } from 'helpers/search';

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

const handleTabChange = activeTabIndex => {
  const selectedTabName = instancesTabUtils.convertIndexToTabName(
    activeTabIndex,
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
  const { namespaceId } = useMicrofrontendContext();

  const serviceClassesRequest = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceclasses`,
    {
      pollingInterval: 3100,
    },
  );
  const clusterServiceClassesRequest = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/clusterserviceclasses`,
    {
      pollingInterval: 2900,
    },
  );

  const serviceInstancesRequest = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceinstances`,
    {
      pollingInterval: 3300,
    },
  );

  if (serviceClassesRequest.error || clusterServiceClassesRequest.error)
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassesList}</EmptyList>
    );

  if (
    serviceClassesRequest.loading ||
    clusterServiceClassesRequest.loading ||
    !serviceClassesRequest.data ||
    !clusterServiceClassesRequest.data
  )
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );

  const allServiceClasses = [
    ...serviceClassesRequest.data,
    ...clusterServiceClassesRequest.data,
  ];

  const [filteredServices, filteredAddons] = determineDisplayedItems(
    allServiceClasses,
    searchQuery,
  );

  return (
    <>
      <ServiceClassToolbar
        searchQuery={searchQuery}
        searchFn={setSearchQuery}
        serviceClassesExists={allServiceClasses.length > 0}
      />

      <Tabs
        defaultActiveTabIndex={determineSelectedTab()}
        callback={handleTabChange}
        className="header-styles"
      >
        <Tab
          status={status(filteredServices.length, 'services-status')}
          title={
            <Tooltip content={serviceClassConstants.servicesTooltipDescription}>
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
                  items={filteredServices}
                  serviceInstances={serviceInstancesRequest.data}
                />
              </CardsWrapper>
            </ServiceClassListWrapper>
          </>
        </Tab>
        <Tab
          status={status(filteredAddons.length, 'addons-status')}
          title={
            <Tooltip content={serviceClassConstants.addonsTooltipDescription}>
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
                  items={filteredAddons}
                  serviceInstances={serviceInstancesRequest.data}
                />
              </CardsWrapper>
            </ServiceClassListWrapper>
          </>
        </Tab>
      </Tabs>
    </>
  );
}
