import React, { useEffect, useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  instancesTabUtils,
  NotificationMessage,
  Spinner,
  Tab,
  Tabs,
  ThemeWrapper,
  Tooltip,
} from '@kyma-project/react-components';
import { Counter } from 'fundamental-react';

import builder from '../../commons/builder';
import { getAllServiceInstances } from '../../queries/queries';
import { deleteServiceInstance } from '../../queries/mutations';
import { SERVICE_INSTANCE_EVENT_SUBSCRIPTION } from '../../queries/subscriptions';
import { serviceInstanceConstants } from '../../variables';

import {
  determineAvailableLabels,
  determineDisplayedInstances,
} from './searchUtils';

import ServiceInstancesTable from './ServiceInstancesTable/ServiceInstancesTable.component';
import ServiceInstancesToolbar from './ServiceInstancesToolbar/ServiceInstancesToolbar.component';
import { handleInstanceEvent } from '../../store/ServiceInstances/events';

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

export default function ServiceInstancesList() {
  const [serviceInstances, setServiceInstances] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLabelFilters, setActiveLabelFilters] = useState([]);

  const [deleteServiceInstanceMutation] = useMutation(deleteServiceInstance);

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    subscribeToMore,
  } = useQuery(getAllServiceInstances, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
  });

  useEffect(() => {
    return subscribeToMore({
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
      },
      document: SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceInstanceEvent
        ) {
          return prev;
        }

        return handleInstanceEvent(
          prev,
          subscriptionData.data.serviceInstanceEvent,
        );
      },
    });
  }, [subscribeToMore]);

  useEffect(() => {
    if (queryData && queryData.serviceInstances) {
      setServiceInstances([...queryData.serviceInstances]);
    }
  }, [queryData]);

  if (queryLoading)
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  if (queryError)
    return (
      <EmptyList>
        An error occurred while loading Service Instances List
      </EmptyList>
    );

  const handleDelete = instanceName => {
    deleteServiceInstanceMutation({
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
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
      <ServiceInstancesToolbar
        searchFn={setSearchQuery}
        onLabelChange={handleLabelChange}
        activeLabelFilters={activeLabelFilters}
        availableLabels={determineAvailableLabels(
          serviceInstances,
          determineSelectedTab(),
          searchQuery,
        )}
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
        borderType="none"
        noMargin
        customStyles={`background-color: #fff;
          padding: 0 15px;`}
        hideSeparator
      >
        <Tab
          noMargin
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
              minWidth="100px"
              showTooltipTimeout={750}
              key="instances-addons-tab-tooltip"
            >
              {serviceInstanceConstants.addons}
            </Tooltip>
          }
        >
          <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
            <ServiceInstancesTable
              data={determineDisplayedInstances(
                serviceInstances,
                serviceInstanceConstants.addonsIndex,
                searchQuery,
                activeLabelFilters,
              )}
              deleteServiceInstance={handleDelete}
            />
          </ServiceInstancesWrapper>
        </Tab>
        <Tab
          noMargin
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
              minWidth="140px"
              showTooltipTimeout={750}
              key="instances-services-tab-tooltip"
            >
              {serviceInstanceConstants.services}
            </Tooltip>
          }
        >
          <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
            <ServiceInstancesTable
              data={determineDisplayedInstances(
                serviceInstances,
                serviceInstanceConstants.servicesIndex,
                searchQuery,
                activeLabelFilters,
              )}
              deleteServiceInstance={handleDelete}
            />
          </ServiceInstancesWrapper>
        </Tab>
      </Tabs>
    </ThemeWrapper>
  );
}
