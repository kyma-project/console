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
      namespace: LuigiClient.getContext().namespaceId,
    },
  });

  useEffect(() => {
    return subscribeToMore({
      variables: {
        namespace: LuigiClient.getContext().namespaceId,
      },
      document: SERVICE_INSTANCE_EVENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          !subscriptionData.data.serviceInstanceEvent
        ) {
          return prev;
        }

        return handleInstanceEventOnList(
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
