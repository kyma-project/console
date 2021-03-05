import React, { useEffect, useState } from 'react';
import LuigiClient from '@luigi-project/client';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  instancesTabUtils,
  NotificationMessage,
  ThemeWrapper,
} from '@kyma-project/react-components';
import {
  Tab,
  Tabs,
  Spinner,
  Tooltip,
  useGetList,
  useMicrofrontendContext,
} from 'react-shared';
import { Identifier } from 'fundamental-react';

import { getAllServiceInstances } from 'helpers/instancesGQL/queries';
import { deleteServiceInstance } from 'helpers/instancesGQL/mutations';
import { SERVICE_INSTANCE_EVENT_SUBSCRIPTION } from 'helpers/instancesGQL/subscriptions';
import { serviceInstanceConstants } from 'helpers/constants';

import {
  determineAvailableLabels,
  determineDisplayedInstances,
} from 'helpers/search';

import ServiceInstanceTable from './ServiceInstanceTable/ServiceInstanceTable.component';
import ServiceInstanceToolbar from './ServiceInstanceToolbar/ServiceInstanceToolbar.component';
import { handleInstanceEventOnList } from 'helpers/instancesGQL/events';

import {
  EmptyList,
  ServiceInstancesWrapper,
  StatusesList,
  StatusWrapper,
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

export default function ServiceInstancesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLabelFilters, setActiveLabelFilters] = useState([]);

  const { namespaceId } = useMicrofrontendContext();

  const [deleteServiceInstanceMutation] = useMutation(deleteServiceInstance);
  const { loading, error, data: serviceInstances } = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceinstances`,
    {
      pollingInterval: 3100,
    },
  );

  if (loading)
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  if (error || !serviceInstances)
    return (
      <EmptyList>
        An error occurred while loading Service Instances List
      </EmptyList>
    );

  const handleDelete = instanceName => {
    deleteServiceInstanceMutation({
      variables: {
        namespace: LuigiClient.getContext().namespaceId,
        name: instanceName,
      },
    });
  };

  const handleLabelChange = (labelId, checked) => {
    if (checked) {
      setActiveLabelFilters([...activeLabelFilters, labelId]);
    } else {
      setActiveLabelFilters(
        [...activeLabelFilters].filter(label => label !== labelId),
      );
    }
  };

  return (
    <ThemeWrapper>
      <ServiceInstanceToolbar
        searchQuery={searchQuery}
        searchFn={setSearchQuery}
        onLabelChange={handleLabelChange}
        activeLabelFilters={[]}
        availableLabels={[]}
        serviceInstancesExists={serviceInstances.length > 0}
      />

      <NotificationMessage
        type="error"
        title="Error"
        message={null} //TODO
      />

      <Tabs
        defaultActiveTabIndex={determineSelectedTab()}
        callback={handleTabChange}
        className="header-styles"
      >
        <Tab
          status={status(
            determineDisplayedInstances(
              serviceInstances,
              serviceInstanceConstants.servicesIndex,
              searchQuery,
              activeLabelFilters,
            ).length,
            'services-status',
          )}
          title={
            <Tooltip
              content={serviceInstanceConstants.servicesTooltipDescription}
            >
              {serviceInstanceConstants.services}
            </Tooltip>
          }
        >
          <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
            <ServiceInstanceTable
              data={determineDisplayedInstances(
                serviceInstances,
                serviceInstanceConstants.servicesIndex,
                searchQuery,
                activeLabelFilters,
              )}
              deleteServiceInstance={handleDelete}
              type="services"
            />
          </ServiceInstancesWrapper>
        </Tab>
        <Tab
          status={status(
            determineDisplayedInstances(
              serviceInstances,
              serviceInstanceConstants.addonsIndex,
              searchQuery,
              activeLabelFilters,
            ).length,
            'addons-status',
          )}
          title={
            <Tooltip
              content={serviceInstanceConstants.addonsTooltipDescription}
            >
              {serviceInstanceConstants.addons}
            </Tooltip>
          }
        >
          <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
            <ServiceInstanceTable
              data={determineDisplayedInstances(
                serviceInstances,
                serviceInstanceConstants.addonsIndex,
                searchQuery,
                activeLabelFilters,
              )}
              deleteServiceInstance={handleDelete}
              type="addons"
            />
          </ServiceInstancesWrapper>
        </Tab>
      </Tabs>
    </ThemeWrapper>
  );
}
