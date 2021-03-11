import React, { useState } from 'react';
import LuigiClient from '@luigi-project/client';
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
  useDelete,
  useNotification,
} from 'react-shared';
import { Identifier } from 'fundamental-react';

import { serviceInstanceConstants } from 'helpers/constants';
import { determineDisplayedInstances } from 'helpers/search';

import ServiceInstanceTable from './ServiceInstanceTable/ServiceInstanceTable.component';
import ServiceInstanceToolbar from './ServiceInstanceToolbar/ServiceInstanceToolbar.component';

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
  const { namespaceId } = useMicrofrontendContext();
  const sendDeleteRequest = useDelete();
  const notificationManager = useNotification();

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

  const handleDelete = async instanceName => {
    try {
      await sendDeleteRequest(
        `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespaceId}/serviceinstances/${instanceName}`,
      );
      notificationManager.notifySuccess({
        content: 'Succesfully deleted ' + instanceName,
      });
    } catch (e) {
      notificationManager.notifyError({
        title: 'Failed to delete the Service Instance',
        content: e.message,
      });
    }
  };

  return (
    <ThemeWrapper>
      <ServiceInstanceToolbar
        searchQuery={searchQuery}
        searchFn={setSearchQuery}
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
